import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Gallery from '@/lib/models/Gallery';

export async function GET() {
  try {
    await connectDB();
    const galleries = await Gallery.find().sort({ publishedAt: -1 }).lean();
    return NextResponse.json(galleries);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const gallery = await Gallery.create(body);
    return NextResponse.json(gallery, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 });
  }
}
