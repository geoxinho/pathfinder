import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';

export async function POST(request) {
  try {
    const body = await request.json();
    const { jobId, fullName, email, phone, highestQualification, yearsOfExperience, coverLetter, cvLink } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Full name, email and phone are required.' },
        { status: 400 }
      );
    }

    const doc = {
      _type: 'teacherApplication',
      fullName,
      email,
      phone,
      highestQualification,
      yearsOfExperience,
      coverLetter,
      cvLink,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    // Link to the job posting if an ID was provided
    if (jobId) {
      doc.jobPosting = { _type: 'reference', _ref: jobId };
    }

    const created = await writeClient.create(doc);
    return NextResponse.json({ success: true, id: created._id }, { status: 201 });
  } catch (error) {
    console.error('Teacher application error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
