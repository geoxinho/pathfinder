import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Staff from '@/lib/models/Staff';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = {};
    if (category) {
      query = { category };
    }
    
    const staff = await Staff.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: staff }, { status: 200 });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Minimal validation
    if (!body.name || !body.category) {
      return NextResponse.json({ success: false, error: 'Name and category are required' }, { status: 400 });
    }
    
    // Remove _id if it's empty to prevent CastError
    if (body._id === "") {
      delete body._id;
    }
    
    const newStaff = await Staff.create(body);
    return NextResponse.json({ success: true, data: newStaff }, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ success: false, error: 'Failed to create staff' }, { status: 500 });
  }
}
