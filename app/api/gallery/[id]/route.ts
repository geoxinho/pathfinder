import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Gallery from '@/lib/models/Gallery';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const gallery = await Gallery.findByIdAndUpdate(id, body, { new: true });
    if (!gallery) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(gallery);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const gallery = await Gallery.findById(id);
    if (!gallery) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete all images from Cloudinary
    for (const img of gallery.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId).catch(console.error);
      }
    }

    await Gallery.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
