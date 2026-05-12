import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FileModel from '@/lib/models/File';

export async function GET() {
  try {
    await connectDB();
    const files = await FileModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(files);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const file = await FileModel.create(body);
    return NextResponse.json(file, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
  }
}
