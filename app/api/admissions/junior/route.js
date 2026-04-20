import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';

export async function POST(request) {
  try {
    const body = await request.json();

    const doc = await writeClient.create({
      _type: 'juniorAdmission',
      ...body,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: doc._id }, { status: 201 });
  } catch (error) {
    console.error('Junior admission error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
