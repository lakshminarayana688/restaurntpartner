// supabase/functions/process-payment-webhook/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { createErrorResponse, createSuccessResponse } from '../_shared/auth.ts';
import { verifyWebhookSignature } from '../_shared/crypto.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const webhookSecret = Deno.env.get('PAYMENT_WEBHOOK_SECRET') || 'feedo_dev_webhook_secret_key_123';

  const adminClient = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const signature = req.headers.get('x-feedo-signature') || req.headers.get('x-razorpay-signature') || '';
    const rawBody = await req.text();

    if (!signature) {
      return createErrorResponse('Missing webhook signature header', 401);
    }

    // Verify cryptographic signature
    const isValid = await verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn('Tampered payment webhook received. Signature verification failed.');
      return createErrorResponse('Invalid webhook signature', 401);
    }

    const payload = JSON.parse(rawBody);
    const { event, event_id, data } = payload;

    if (!event || !event_id || !data?.order_id) {
      return createErrorResponse('Malformed webhook payload structure', 422);
    }

    const orderId = data.order_id;
    const paymentStatus = event === 'payment.captured' ? 'PAID' : event === 'payment.failed' ? 'FAILED' : 'REFUNDED';

    // Idempotency check in audit logs
    const { data: existingLog } = await adminClient
      .from('audit_logs')
      .select('id')
      .eq('action', 'PAYMENT_WEBHOOK_PROCESSED')
      .eq('resource_id', orderId)
      .contains('metadata', { event_id })
      .maybeSingle();

    if (existingLog) {
      // Already processed this webhook event
      return createSuccessResponse({ message: 'Webhook already processed (idempotent)', event_id });
    }

    // Update order payment status
    const { data: updatedOrder, error: orderErr } = await adminClient
      .from('orders')
      .update({
        payment_status: paymentStatus,
        payment_method: data.payment_method || 'UPI',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select('id, restaurant_id, total_amount, payment_status')
      .single();

    if (orderErr || !updatedOrder) {
      return createErrorResponse(`Order '${orderId}' not found`, 404);
    }

    // Record Audit Log
    await adminClient.from('audit_logs').insert({
      restaurant_id: updatedOrder.restaurant_id,
      action: 'PAYMENT_WEBHOOK_PROCESSED',
      resource_type: 'orders',
      resource_id: orderId,
      metadata: {
        event,
        event_id,
        payment_status: paymentStatus,
        amount: data.amount,
      },
    });

    return createSuccessResponse({
      order_id: orderId,
      payment_status: paymentStatus,
      processed: true,
    });
  } catch (err: any) {
    console.error('Unhandled payment webhook exception:', err);
    return createErrorResponse('Internal webhook processing error', 500);
  }
});
