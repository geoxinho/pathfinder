import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { SeniorAdmission } from '@/lib/models/Admission';
import { sendAdmissionEmails } from '@/lib/admissionEmail';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

async function verifyPayment(reference: string) {
  if (!PAYSTACK_SECRET || PAYSTACK_SECRET.includes('xxx')) {
    console.warn('[Paystack] Secret key not configured. Skipping verification.');
    return true; 
  }

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    });
    const data = await res.json();
    return data.status && data.data.status === 'success';
  } catch (err) {
    console.error('[Paystack] Verification error:', err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Verify payment if not "free"
    if (body.paymentStatus === 'paid' && body.paymentReference) {
      const isValid = await verifyPayment(body.paymentReference);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Invalid payment reference' }, { status: 400 });
      }
    }

    const admission = await SeniorAdmission.create(body);

    // Send confirmation emails (non-blocking)
    sendAdmissionEmails(body, 'Senior').catch(err =>
      console.error('[Senior Admission] Email error:', err)
    );

    return NextResponse.json({ success: true, admission });
  } catch (err: any) {
    console.error('Senior admission error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
