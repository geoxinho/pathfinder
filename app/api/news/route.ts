import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import News from '@/lib/models/News';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = await News.findOne({ slug }).lean();
      if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(post);
    }

    const posts = await News.find().sort({ publishedAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Auto-generate slug if not provided
    if (!body.slug) {
      let baseSlug = slugify(body.title || '');
      let slug = baseSlug;
      let count = 1;
      while (await News.findOne({ slug })) {
        slug = `${baseSlug}-${count++}`;
      }
      body.slug = slug;
    }

    const post = await News.create(body);
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
