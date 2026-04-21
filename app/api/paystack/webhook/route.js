import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Paystack sends a POST to this endpoint after every payment event.
// We verify the signature using your Paystack secret key, then handle the event.

export async function POST(request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Read raw body as text so we can verify the HMAC signature
    const rawBody = await request.text();

    // Paystack signature is in the x-paystack-signature header
    const paystackSignature = request.headers.get('x-paystack-signature');

    if (!paystackSignature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // Compute expected HMAC-SHA512 signature
    const expectedSignature = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    // Reject if signatures don't match (someone forged the request)
    if (expectedSignature !== paystackSignature) {
      console.warn('Paystack webhook: signature mismatch — possible spoofed request.');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the verified payload
    const event = JSON.parse(rawBody);

    console.log('✅ Paystack webhook received:', event.event);

    // Handle different Paystack events
    switch (event.event) {
      case 'charge.success': {
        const { reference, amount, customer, metadata } = event.data;

        console.log(`💰 Payment successful!
  Reference : ${reference}
  Amount    : ₦${(amount / 100).toLocaleString()}
  Customer  : ${customer?.email}
  Metadata  : ${JSON.stringify(metadata)}`);

        // ✅ You can add extra logic here, e.g.:
        // - Update a database record
        // - Send a confirmation email
        // - Mark an admission as "payment confirmed"

        break;
      }

      case 'charge.failed': {
        const { reference, customer } = event.data;
        console.warn(`❌ Payment failed. Reference: ${reference}, Customer: ${customer?.email}`);
        break;
      }

      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }

    // Always respond with 200 to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
