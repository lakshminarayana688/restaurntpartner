// src/services/deliveryService.ts
import { isDemoMode } from './config';
import { ApiResponse, createSuccessResponse, createErrorResponse } from './types';
import { DeliveryPartner } from '../types/order';

export const deliveryService = {
  /**
   * Assign rider to order
   */
  async assignRider(orderId: string): Promise<ApiResponse<DeliveryPartner>> {
    const demoRider: DeliveryPartner = {
      id: 'rider-arun',
      name: 'Arun Kumar',
      phoneMasked: '+91 91*** **890',
      vehicleNumber: 'KA 05 AB 1234',
      vehicleModel: 'Hero Splendor (Black)',
      rating: 4.8,
      distanceKm: 1.2,
      etaMinutes: 6,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    };

    if (isDemoMode()) {
      return createSuccessResponse(demoRider);
    }

    // In production, delivery dispatch API or webhook provides assigned rider
    return createSuccessResponse(demoRider);
  },

  /**
   * Verify pickup code entered at counter
   */
  verifyPickupCode(expectedCode: string, enteredCode?: string): boolean {
    if (!enteredCode || !expectedCode) return false;
    return enteredCode.trim() === expectedCode.trim();
  },
};
