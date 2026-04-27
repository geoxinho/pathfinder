import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';

// POST — create a new job posting
export async function POST(request) {
  try {
    const body = await request.json();
    const { subject, department, level, type, description, requirements, deadline, status } = body;

    if (!subject || !department || !description || !requirements || !deadline) {
      return NextResponse.json(
        { success: false, error: 'Subject, department, description, requirements and deadline are required.' },
        { status: 400 }
      );
    }

    const doc = await writeClient.create({
      _type: 'jobPosting',
      subject,
      department,
      level:        level        || 'Both',
      type:         type         || 'Full-Time',
      description,
      requirements,
      deadline,
      status:       status       || 'Open',
      postedAt:     new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: doc._id }, { status: 201 });
  } catch (error) {
    console.error('Admin careers POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH — update the status of an existing posting
export async function PATCH(request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required.' }, { status: 400 });
    }

    await writeClient.patch(id).set({ status }).commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin careers PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE — remove a job posting
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'id query param is required.' }, { status: 400 });
    }

    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin careers DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
