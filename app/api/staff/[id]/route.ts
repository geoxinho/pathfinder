import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Staff from '@/lib/models/Staff';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    const staff = await Staff.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!staff) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: staff }, { status: 200 });
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ success: false, error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const staff = await Staff.findByIdAndDelete(id);
    
    if (!staff) {
      return NextResponse.json({ success: false, error: 'Staff member not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete staff' }, { status: 500 });
  }
}
