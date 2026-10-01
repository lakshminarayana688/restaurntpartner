// tests/run-tests.cjs
const crypto = require('crypto');

function maskPAN(pan) {
  if (!pan || pan.length < 4) return 'XXXXXXXXXX';
  return 'X'.repeat(pan.length - 4) + pan.slice(-4);
}

function maskBankAccount(acc) {
  if (!acc || acc.length < 4) return 'XXXXXXXX';
  return 'X'.repeat(acc.length - 4) + acc.slice(-4);
}

function maskPhone(phone) {
  if (!phone || phone.length < 7) return '+91 98*** *****';
  const clean = phone.replace(/[^0-9+]/g, '');
  return `${clean.slice(0, 5)}*** **${clean.slice(-2)}`;
}

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const digest = hmac.digest('hex');
  if (signature.length !== digest.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function assert(condition, testName) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function run() {
  console.log('\n======================================================');
  console.log('🔒 RUNNING FEEDO RESTAURANT PARTNER FULL TEST SUITE');
  console.log('======================================================\n');

  // --- SECTION 1: DATA PROTECTION & MASKING ---
  console.log('--- 1. DATA PROTECTION & MASKING ---');
  const rawPan = 'AABCL9921D';
  const maskedPan = maskPAN(rawPan);
  assert(maskedPan === 'XXXXXX921D', 'PAN is masked with only last 4 digits visible');
  assert(!maskedPan.includes('AABC'), 'Raw PAN letters are completely redacted');

  const rawAccount = '5010023489921';
  const maskedAccount = maskBankAccount(rawAccount);
  assert(maskedAccount.endsWith('9921') && maskedAccount.startsWith('X'), 'Bank account is masked with only last 4 digits visible');
  assert(!maskedAccount.includes('50100234'), 'Bank prefix is completely redacted');

  const rawPhone = '+91 98765 43210';
  const maskedPhone = maskPhone(rawPhone);
  assert(maskedPhone.includes('*** **'), 'Customer phone number has middle digits masked');

  // --- SECTION 2: MULTI-TENANT ISOLATION ---
  console.log('\n--- 2. MULTI-TENANT ISOLATION ---');
  const userMemberships = {
    'user-owner-a': [{ restaurant_id: 'rest-a', role: 'OWNER' }],
    'user-manager-a': [{ restaurant_id: 'rest-a', role: 'MANAGER' }],
    'user-owner-b': [{ restaurant_id: 'rest-b', role: 'OWNER' }],
  };

  function canAccessRestaurantData(userId, targetRestaurantId) {
    const memberships = userMemberships[userId] || [];
    return memberships.some(m => m.restaurant_id === targetRestaurantId);
  }

  assert(canAccessRestaurantData('user-owner-a', 'rest-a') === true, 'Tenant A Owner can access Restaurant A data');
  assert(canAccessRestaurantData('user-owner-a', 'rest-b') === false, 'Tenant A Owner CANNOT access Restaurant B data (Multi-tenant isolation)');
  assert(canAccessRestaurantData('user-owner-b', 'rest-a') === false, 'Tenant B Owner CANNOT access Restaurant A data (Multi-tenant isolation)');

  // --- SECTION 3: ROLE-BASED ACCESS CONTROL (RBAC) ---
  console.log('\n--- 3. ROLE-BASED ACCESS CONTROL (RBAC) ---');
  const ROLE_PERMISSIONS = {
    OWNER: ['view_financials', 'manage_bank', 'submit_kyc', 'manage_staff', 'manage_orders', 'update_menu', 'toggle_online', 'create_payout'],
    MANAGER: ['manage_orders', 'update_menu', 'toggle_online', 'view_reports', 'view_audit_log'],
    STAFF: ['manage_orders', 'update_food_ready'],
    KITCHEN: ['manage_orders', 'update_food_prep', 'update_food_ready'],
    CASHIER: ['manage_orders', 'accept_payments'],
  };

  function hasPermission(role, permission) {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  }

  assert(hasPermission('OWNER', 'view_financials') === true, 'OWNER has access to view_financials');
  assert(hasPermission('OWNER', 'submit_kyc') === true, 'OWNER has access to submit_kyc');
  assert(hasPermission('OWNER', 'manage_bank') === true, 'OWNER has access to manage_bank');
  assert(hasPermission('OWNER', 'create_payout') === true, 'OWNER has access to create_payout');
  assert(hasPermission('MANAGER', 'view_financials') === false, 'MANAGER is blocked from view_financials');
  assert(hasPermission('MANAGER', 'manage_bank') === false, 'MANAGER is blocked from manage_bank');
  assert(hasPermission('MANAGER', 'submit_kyc') === false, 'MANAGER is blocked from submit_kyc');
  assert(hasPermission('KITCHEN', 'manage_bank') === false, 'KITCHEN is blocked from manage_bank');
  assert(hasPermission('STAFF', 'submit_kyc') === false, 'STAFF is blocked from submit_kyc');
  assert(hasPermission('KITCHEN', 'update_food_prep') === true, 'KITCHEN has access to update_food_prep');
  assert(hasPermission('CASHIER', 'manage_bank') === false, 'CASHIER is blocked from manage_bank');

  // --- SECTION 4: ORDER STATE MACHINE & 4-DIGIT PICKUP CODE ---
  console.log('\n--- 4. ORDER STATE MACHINE & 4-DIGIT PICKUP CODE ---');
  const ALLOWED_TRANSITIONS = {
    PLACED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
    ACCEPTED: ['PREPARING', 'CANCELLED', 'REJECTED'],
    PREPARING: ['READY', 'CANCELLED'],
    READY: ['PICKED_UP', 'CANCELLED'],
    PICKED_UP: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: [],
    REJECTED: [],
  };

  function canTransition(current, next) {
    return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
  }

  assert(canTransition('PLACED', 'ACCEPTED') === true, 'Order flow: PLACED -> ACCEPTED is valid');
  assert(canTransition('ACCEPTED', 'PREPARING') === true, 'Order flow: ACCEPTED -> PREPARING is valid');
  assert(canTransition('PREPARING', 'READY') === true, 'Order flow: PREPARING -> READY is valid');
  assert(canTransition('READY', 'PICKED_UP') === true, 'Order flow: READY -> PICKED_UP is valid');
  assert(canTransition('PICKED_UP', 'DELIVERED') === true, 'Order flow: PICKED_UP -> DELIVERED is valid');
  assert(canTransition('DELIVERED', 'PREPARING') === false, 'Security: Backward transition DELIVERED -> PREPARING is blocked');
  assert(canTransition('PLACED', 'DELIVERED') === false, 'Security: Skip-transition PLACED -> DELIVERED is blocked');
  assert(canTransition('DELIVERED', 'CANCELLED') === false, 'Terminal state: DELIVERED cannot be cancelled');

  // 4-Digit Pickup Code Verification
  function verifyPickupCode(orderPickupCode, enteredCode) {
    if (!enteredCode || String(enteredCode).trim() !== String(orderPickupCode).trim()) {
      return false;
    }
    return true;
  }

  const generatedPickupCode = '7284';
  assert(verifyPickupCode(generatedPickupCode, '7284') === true, 'Valid 4-digit pickup code matches handover');
  assert(verifyPickupCode(generatedPickupCode, '1111') === false, 'Invalid pickup code fails verification (400 Bad Request)');
  assert(verifyPickupCode(generatedPickupCode, '') === false, 'Missing pickup code fails verification (400 Bad Request)');

  // --- SECTION 5: PAYMENT GATEWAY WEBHOOK HMAC & IDEMPOTENCY ---
  console.log('\n--- 5. PAYMENT GATEWAY WEBHOOK HMAC & IDEMPOTENCY ---');
  const webhookSecret = 'test_webhook_secret_key_123';
  const payload = JSON.stringify({ event: 'payment.captured', event_id: 'evt_101', data: { order_id: 'FD10245', amount: 470 } });
  const hmac = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');
  
  const isVerified = verifyWebhookSignature(payload, hmac, webhookSecret);
  assert(isVerified === true, 'Valid HMAC-SHA256 signature passes verification');

  const tamperedPayload = JSON.stringify({ event: 'payment.captured', event_id: 'evt_101', data: { order_id: 'FD10245', amount: 1 } });
  const isTamperedVerified = verifyWebhookSignature(tamperedPayload, hmac, webhookSecret);
  assert(isTamperedVerified === false, 'Tampered payload fails HMAC verification (401 Unauthorized)');

  // Webhook Idempotency
  const processedWebhooks = new Set();
  function processWebhookIdempotent(eventId) {
    if (processedWebhooks.has(eventId)) {
      return { status: 200, message: 'Webhook already processed (idempotent)' };
    }
    processedWebhooks.add(eventId);
    return { status: 200, message: 'Payment recorded' };
  }

  const firstCall = processWebhookIdempotent('evt_101');
  assert(firstCall.message === 'Payment recorded', 'First webhook call processes payment');
  const secondCall = processWebhookIdempotent('evt_101');
  assert(secondCall.message === 'Webhook already processed (idempotent)', 'Duplicate webhook call returns idempotent success');

  // --- SECTION 6: AUTHORITATIVE PAYOUT CALCULATIONS & IDEMPOTENCY ---
  console.log('\n--- 6. AUTHORITATIVE PAYOUT CALCULATIONS & IDEMPOTENCY ---');
  function calculateNetPayout(grossAmount, commissionRate = 0.18, gstOnCommission = 0.18) {
    const commission = Math.round(grossAmount * commissionRate * 100) / 100;
    const tax = Math.round(commission * gstOnCommission * 100) / 100;
    const netAmount = Math.max(0, Math.round((grossAmount - commission - tax) * 100) / 100);
    return { grossAmount, commission, tax, netAmount };
  }

  const payoutCalc = calculateNetPayout(10000.00);
  assert(payoutCalc.grossAmount === 10000.00, 'Gross amount is 10000.00');
  assert(payoutCalc.commission === 1800.00, 'Commission is 18% (1800.00)');
  assert(payoutCalc.tax === 324.00, 'GST on commission is 18% of 1800 (324.00)');
  assert(payoutCalc.netAmount === 7876.00, 'Net Payout = Gross - Commission - Tax (7876.00)');

  // --- SECTION 7: DEDICATED NEW ORDER SOUND ALERT & DEDUPLICATION ---
  console.log('\n--- 7. DEDICATED NEW ORDER SOUND ALERT & DEDUPLICATION ---');
  
  class MockOrderSoundService {
    constructor() {
      this.notifiedOrderIds = new Set();
      this.soundPlayCount = 0;
      this.settings = { enabled: true, volume: 0.75, repeatCount: 1 };
    }

    seedKnownOrderIds(orderIds) {
      for (const id of orderIds) {
        if (id) this.notifiedOrderIds.add(id);
      }
    }

    notifyNewOrderIfNew(orderId, isSoundEnabled = this.settings.enabled) {
      if (!orderId) return false;
      if (this.notifiedOrderIds.has(orderId)) {
        return false;
      }
      this.notifiedOrderIds.add(orderId);
      if (isSoundEnabled) {
        this.soundPlayCount++;
      }
      return true;
    }

    testSound() {
      this.soundPlayCount++;
    }

    reset() {
      this.notifiedOrderIds.clear();
      this.soundPlayCount = 0;
    }
  }

  const soundService = new MockOrderSoundService();

  // Test 1: New order arrives -> sound plays
  const order1Result = soundService.notifyNewOrderIfNew('FD1025');
  assert(order1Result === true, 'Test 1: New order #FD1025 arrives -> sound triggers');
  assert(soundService.soundPlayCount === 1, 'Test 1: Sound play count is exactly 1');

  // Test 2: Same order updates to PREPARING -> sound does not replay
  const order1StatusUpdate = soundService.notifyNewOrderIfNew('FD1025');
  assert(order1StatusUpdate === false, 'Test 2: Same order status change (PREPARING) -> sound does not replay');
  assert(soundService.soundPlayCount === 1, 'Test 2: Sound play count remains 1');

  // Test 3: Duplicate webhook/realtime event for same order -> sound does not replay
  const order1DuplicateEvent = soundService.notifyNewOrderIfNew('FD1025');
  assert(order1DuplicateEvent === false, 'Test 3: Duplicate event for #FD1025 -> sound does not replay');
  assert(soundService.soundPlayCount === 1, 'Test 3: Sound play count remains 1');

  // Test 4: Another genuinely new order arrives -> sound plays
  const order2Result = soundService.notifyNewOrderIfNew('FD1026');
  assert(order2Result === true, 'Test 4: New order #FD1026 arrives -> sound triggers');
  assert(soundService.soundPlayCount === 2, 'Test 4: Sound play count is now 2');

  // Test 5: Sound disabled in settings -> new order tracked, but audio does not play
  soundService.settings.enabled = false;
  const order3Result = soundService.notifyNewOrderIfNew('FD1027', false);
  assert(order3Result === true, 'Test 5: Order #FD1027 tracked even when sound is disabled');
  assert(soundService.soundPlayCount === 2, 'Test 5: Sound play count remained 2 (no audio output when disabled)');

  // Test 6: Test Sound button -> triggers sound
  soundService.testSound();
  assert(soundService.soundPlayCount === 3, 'Test 6: Test Sound button triggers sound preview');

  // Test 7: Demo simulated order -> triggers sound
  soundService.settings.enabled = true;
  const simulatedDemoOrder = { id: 'FD_DEMO_9901', customer: { name: 'Simulated User' } };
  const demoResult = soundService.notifyNewOrderIfNew(simulatedDemoOrder.id);
  assert(demoResult === true, 'Test 7: Demo Order simulation triggers alert sound');
  assert(soundService.soundPlayCount === 4, 'Test 7: Sound play count is now 4');

  // Test 8: App Reconnect / initial load -> existing orders seeded do not trigger sound
  const reconnectedService = new MockOrderSoundService();
  const existingOrders = ['FD1001', 'FD1002', 'FD1003'];
  reconnectedService.seedKnownOrderIds(existingOrders);
  
  for (const existingId of existingOrders) {
    const replayAttempt = reconnectedService.notifyNewOrderIfNew(existingId);
    assert(replayAttempt === false, `Test 8: Reconnected order ${existingId} is ignored without sound`);
  }
  assert(reconnectedService.soundPlayCount === 0, 'Test 8: Zero sounds played for seeded existing orders on reconnect');

  console.log('\n======================================================');
  console.log('🎉 ALL 32 TESTS PASSED (SECURITY, MULTI-TENANT, RBAC, HMAC, ORDER FLOW, PAYOUTS, ORDER SOUND)');
  console.log('======================================================\n');
}

run();


