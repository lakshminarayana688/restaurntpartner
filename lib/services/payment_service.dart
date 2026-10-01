import '../core/config/app_config.dart';
import '../core/config/supabase_config.dart';
import '../models/api_response.dart';

class PaymentService {
  Future<ApiResponse<String>> getPaymentStatus(String orderId) async {
    try {
      if (AppConfig.isDemo) {
        return ApiResponse.success('PAID', mode: 'DEMO');
      }

      if (!SupabaseConfig.isInitialized) {
        await SupabaseConfig.initialize();
      }

      final res = await SupabaseConfig.client
          .from('orders')
          .select('payment_status')
          .eq('id', orderId)
          .single();

      final status = res['payment_status'] as String? ?? 'PENDING';
      return ApiResponse.success(status, mode: 'PRODUCTION');
    } catch (e) {
      return ApiResponse.failure('Could not retrieve payment status.', details: e.toString());
    }
  }
}
