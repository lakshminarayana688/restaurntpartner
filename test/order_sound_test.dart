import 'package:flutter_test/flutter_test.dart';
import 'package:feedo_partner/services/order_sound_service.dart';

void main() {
  group('OrderSoundService Tests (Flutter)', () {
    late OrderSoundService service;

    setUp(() {
      service = OrderSoundService();
      service.reset();
      service.setSoundEnabled(true);
    });

    test('1. New order arrives -> notifyNewOrderIfNew returns true', () {
      final result = service.notifyNewOrderIfNew('FD1025');
      expect(result, isTrue);
      expect(service.hasOrderBeenNotified('FD1025'), isTrue);
    });

    test('2. Same order status update -> sound does not replay', () {
      service.notifyNewOrderIfNew('FD1025');
      // Simulate status transition update for same order
      final updateResult = service.notifyNewOrderIfNew('FD1025');
      expect(updateResult, isFalse);
    });

    test('3. Duplicate event for same order -> sound does not replay', () {
      service.notifyNewOrderIfNew('FD1025');
      final dupResult = service.notifyNewOrderIfNew('FD1025');
      expect(dupResult, isFalse);
    });

    test('4. Genuinely new order arrives -> sound plays and returns true', () {
      service.notifyNewOrderIfNew('FD1025');
      final newOrderResult = service.notifyNewOrderIfNew('FD1026');
      expect(newOrderResult, isTrue);
      expect(service.hasOrderBeenNotified('FD1026'), isTrue);
    });

    test('5. Sound disabled -> new order is tracked but sound is disabled', () {
      service.setSoundEnabled(false);
      final result = service.notifyNewOrderIfNew('FD1027');
      expect(result, isTrue);
      expect(service.hasOrderBeenNotified('FD1027'), isTrue);
    });

    test('6. Test Sound triggers successfully without errors', () async {
      await expectLater(service.testSound(), completes);
    });

    test('7. Seeded existing orders on reconnect do not trigger sound', () {
      final existingIds = ['FD1001', 'FD1002', 'FD1003'];
      service.seedKnownOrderIds(existingIds);

      for (final id in existingIds) {
        expect(service.hasOrderBeenNotified(id), isTrue);
        final attempt = service.notifyNewOrderIfNew(id);
        expect(attempt, isFalse);
      }
    });

    test('8. FCM background payload parses and routes order notification', () {
      final payload = {'order_id': 'FD_FCM_99', 'type': 'NEW_ORDER'};
      final handled = service.handleFCMBackgroundMessage(payload);
      expect(handled, isTrue);

      final dupHandled = service.handleFCMBackgroundMessage(payload);
      expect(dupHandled, isFalse);
    });
  });
}
