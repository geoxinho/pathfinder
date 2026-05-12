import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { JuniorAdmission, SeniorAdmission } from '@/lib/models/Admission';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;

    // Try finding in Junior
    let admission = await JuniorAdmission.findById(id).lean();
    let type = 'Junior';

    // If not found, try Senior
    if (!admission) {
      admission = await SeniorAdmission.findById(id).lean();
      type = 'Senior';
    }

    if (!admission) {
      return NextResponse.json({ success: false, error: 'Admission not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: JSON.parse(JSON.stringify(admission)),
      type 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
