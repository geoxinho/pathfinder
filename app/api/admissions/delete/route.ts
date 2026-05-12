import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { JuniorAdmission, SeniorAdmission } from '@/lib/models/Admission';

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    // Try deleting from both
    const res1 = await JuniorAdmission.findByIdAndDelete(id);
    const res2 = await SeniorAdmission.findByIdAndDelete(id);

    if (res1 || res2) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
