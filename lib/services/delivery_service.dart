import '../core/config/app_config.dart';
import '../core/config/supabase_config.dart';
import '../demo/demo_data.dart';
import '../models/api_response.dart';
import '../models/order_model.dart';

class DeliveryService {
  Future<ApiResponse<DeliveryPartner>> assignRider(String orderId) async {
    try {
      if (AppConfig.isDemo) {
        await Future.delayed(const Duration(milliseconds: 400));
        return ApiResponse.success(DemoData.demoRider, mode: 'DEMO');
      }

      if (!SupabaseConfig.isInitialized) {
        await SupabaseConfig.initialize();
      }

      final res = await SupabaseConfig.client.functions.invoke(
        'verify-pickup-code',
        body: {'order_id': orderId, 'action': 'ASSIGN_RIDER'},
      );

      if (res.status >= 400) {
        return ApiResponse.failure('Rider allocation failed.', code: 'RIDER_ERROR');
      }

      return ApiResponse.success(DeliveryPartner.fromJson(res.data), mode: 'PRODUCTION');
    } catch (e) {
      return ApiResponse.failure('Error allocating delivery partner.', details: e.toString());
    }
  }

  Future<ApiResponse<bool>> verifyPickupCode(String orderId, String code) async {
    try {
      if (AppConfig.isDemo) {
        await Future.delayed(const Duration(milliseconds: 300));
        final valid = code == AppConfig.demoPickupCode || code == '7284';
        if (valid) {
          return ApiResponse.success(true, mode: 'DEMO');
        } else {
          return ApiResponse.failure('Invalid 4-digit pickup code.', code: 'INVALID_CODE');
        }
      }

      if (!SupabaseConfig.isInitialized) {
        await SupabaseConfig.initialize();
      }

      final res = await SupabaseConfig.client.functions.invoke(
        'verify-pickup-code',
        body: {'order_id': orderId, 'pickup_code': code},
      );

      if (res.status >= 400) {
        return ApiResponse.failure('Pickup code verification failed.', code: 'INVALID_CODE');
      }

      return ApiResponse.success(true, mode: 'PRODUCTION');
    } catch (e) {
      return ApiResponse.failure('Error validating pickup code.', details: e.toString());
    }
  }
}
