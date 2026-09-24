// supabase/functions/process-payout/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { handleCors } from '../_shared/cors.ts';
import { createErrorResponse, createSuccessResponse } from '../_shared/auth.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  // Payout processing requires System Cron / Service Role authorization
  const authHeader = req.headers.get('Authorization') || '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';

  if (!authHeader.includes(serviceKey)) {
    return createErrorResponse('Unauthorized: Payout processing requires system service credentials', 401);
  }

  const adminClient = createClient(supabaseUrl, serviceKey);

  try {
    const body = await req.json();
    const { payout_id, utr_reference, status = 'COMPLETED' } = body;

    if (!payout_id || !utr_reference) {
      return createErrorResponse('Missing required fields (payout_id, utr_reference)', 422);
    }

    const { data: updatedPayout, error: updateErr } = await adminClient
      .from('payouts')
      .update({
        status,
        utr_reference: utr_reference.trim(),
        processed_at: new Date().toISOString(),
      })
      .eq('id', payout_id)
      .select()
      .single();

    if (updateErr || !updatedPayout) {
      return createErrorResponse('Failed to update payout settlement status', 500);
    }

    // Audit Log
    await adminClient.from('audit_logs').insert({
      restaurant_id: updatedPayout.restaurant_id,
      action: 'PAYOUT_COMPLETED',
      resource_type: 'payouts',
      resource_id: payout_id,
      metadata: { utr_reference, status, net_amount: updatedPayout.net_amount },
    });

    return createSuccessResponse(updatedPayout);
  } catch (err: any) {
    console.error('Unhandled process-payout exception:', err);
    return createErrorResponse('Internal error processing payout settlement', 500);
  }
});
