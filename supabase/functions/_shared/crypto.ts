// supabase/functions/_shared/crypto.ts

/**
 * Mask customer phone number e.g. "+91 98765 43210" -> "+91 98*** **210"
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 8) return '******';
  const clean = phone.trim();
  const start = clean.slice(0, 5);
  const end = clean.slice(-3);
  return `${start}*** **${end}`;
}

/**
 * Mask PAN number e.g. "ABCDE1234F" -> "XXXXXX1234"
 */
export function maskPAN(pan: string): string {
  if (!pan || pan.length < 4) return 'XXXXXX';
  const last4 = pan.slice(-4);
  return `XXXXXX${last4}`;
}

/**
 * Mask Bank Account Number e.g. "5010023489921" -> "XXXXXX9921"
 */
export function maskBankAccount(account: string): string {
  if (!account || account.length < 4) return 'XXXX';
  const last4 = account.slice(-4);
  return `XXXXXX${last4}`;
}

/**
 * Extract last 4 alphanumeric characters
 */
export function getLast4(str: string): string {
  if (!str) return 'XXXX';
  return str.trim().slice(-4);
}

/**
 * Simple AES-GCM Encrypt string using an encryption secret key
 */
export async function encryptSensitiveData(plainText: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey.padEnd(32, '0').slice(0, 32));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoder.encode(plainText)
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Verify HMAC-SHA256 signature for Payment Webhooks (e.g. Razorpay / Cashfree)
 */
export async function verifyWebhookSignature(
  rawPayload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const calculatedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawPayload));
    const hexSig = Array.from(new Uint8Array(calculatedSig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return hexSig.toLowerCase() === signature.toLowerCase();
  } catch (err) {
    console.error('Webhook signature verification error:', err);
    return false;
  }
}
