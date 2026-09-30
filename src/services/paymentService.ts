// src/services/paymentService.ts
import { isDemoMode } from './config';
import { ApiResponse, createSuccessResponse, createErrorResponse } from './types';
import { PaymentStatus } from '../types/order';
import { getSupabaseClient, invokeEdgeFunction } from '../utils/supabase';

export const paymentService = {
  /**
   * Check payment status for order from database (Never trust client input)
   */
  async getPaymentStatus(orderId: string): Promise<ApiResponse<{ status: PaymentStatus; method: string }>> {
    if (isDemoMode()) {
      return createSuccessResponse({
        status: 'PAID',
        method: 'UPI (Google Pay)',
      });
    }

    const client = getSupabaseClient();
    if (!client) {
      return createErrorResponse('NETWORK_ERROR', 'Supabase client not configured');
    }

    try {
      const { data, error } = await client
        .from('orders')
        .select('payment_status, payment_method')
        .eq('id', orderId)
        .single();

      if (error || !data) {
        return createErrorResponse('NOT_FOUND', 'Payment record not found');
      }

      return createSuccessResponse({
        status: (data.payment_status || 'PENDING') as PaymentStatus,
        method: data.payment_method || 'UPI',
      });
    } catch (err: any) {
      return createErrorResponse('INTERNAL_ERROR', err.message || 'Failed to check payment status');
    }
  },

  /**
   * Process payment gateway webhook
   */
  async processPaymentWebhook(payload: any, signature: string): Promise<ApiResponse<any>> {
    if (isDemoMode()) {
      return createSuccessResponse({ processed: true, event_id: payload.event_id || 'demo_evt' });
    }

    const res = await invokeEdgeFunction('process-payment-webhook', payload);
    if (!res.success) {
      return createErrorResponse('UNAUTHORIZED', res.error || 'Webhook verification failed');
    }

    return createSuccessResponse(res.data);
  },
};
