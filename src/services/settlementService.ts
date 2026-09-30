// src/services/settlementService.ts
import { isDemoMode } from './config';
import { ApiResponse, createSuccessResponse, createErrorResponse } from './types';
import { SettlementRecord } from '../types/extras';
import { initialSettlements } from '../data/initialExtras';
import { getSupabaseClient, invokeEdgeFunction } from '../utils/supabase';

export const settlementService = {
  /**
   * Fetch settlement ledger
   */
  async getSettlements(restaurantId?: string): Promise<ApiResponse<SettlementRecord[]>> {
    if (isDemoMode()) {
      return createSuccessResponse(initialSettlements);
    }

    const client = getSupabaseClient();
    if (!client) {
      return createErrorResponse('NETWORK_ERROR', 'Supabase client not configured');
    }

    try {
      let query = client.from('payouts').select('*').order('created_at', { ascending: false });
      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId);
      }

      const { data, error } = await query;
      if (error) {
        return createErrorResponse('BAD_REQUEST', error.message);
      }

      const records: SettlementRecord[] = (data || []).map((row: any) => ({
        id: row.id,
        payoutRef: row.settlement_reference,
        date: new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        grossAmount: Number(row.amount) || 0,
        commission: Number(row.commission) || 0,
        taxes: Number(row.tax) || 0,
        netPayout: Number(row.net_amount) || 0,
        status: row.status === 'COMPLETED' ? 'SETTLED' : 'PROCESSING',
      }));

      return createSuccessResponse(records);
    } catch (err: any) {
      return createErrorResponse('INTERNAL_ERROR', err.message || 'Failed to fetch settlements');
    }
  },

  /**
   * Calculate and create daily payout batch (authoritative backend)
   */
  async createPayout(
    restaurantId: string,
    periodStart: string,
    periodEnd: string
  ): Promise<ApiResponse<any>> {
    if (isDemoMode()) {
      return createSuccessResponse({
        id: 'demo-payout-id',
        settlement_reference: `SET-${periodStart.replace(/-/g, '')}`,
        amount: 18450,
        commission: 3321,
        tax: 597.78,
        net_amount: 14531.22,
        status: 'PENDING',
      });
    }

    const res = await invokeEdgeFunction(
      'create-payout',
      { restaurant_id: restaurantId, period_start: periodStart, period_end: periodEnd },
      restaurantId
    );

    if (!res.success) {
      return createErrorResponse('BAD_REQUEST', res.error || 'Failed to generate settlement batch');
    }

    return createSuccessResponse(res.data);
  },

  /**
   * Process settlement clearing
   */
  async processPayout(payoutId: string, utrReference: string): Promise<ApiResponse<any>> {
    if (isDemoMode()) {
      return createSuccessResponse({
        payout_id: payoutId,
        utr_reference: utrReference,
        status: 'COMPLETED',
      });
    }

    const res = await invokeEdgeFunction('process-payout', {
      payout_id: payoutId,
      utr_reference: utrReference,
      status: 'COMPLETED',
    });

    if (!res.success) {
      return createErrorResponse('BAD_REQUEST', res.error || 'Failed to process payout clearing');
    }

    return createSuccessResponse(res.data);
  },
};
