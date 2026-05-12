import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { JuniorAdmission } from '@/lib/models/Admission';

export async function GET() {
  try {
    await connectDB();
    const data = await JuniorAdmission.find({}).sort({ submittedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(data)) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
