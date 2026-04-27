import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET() {
  try {
    const jobs = await client.fetch(
      `*[_type == "jobPosting"] | order(postedAt desc) {
        _id,
        subject,
        department,
        level,
        type,
        description,
        requirements,
        deadline,
        status,
        postedAt
      }`,
      {},
      { next: { revalidate: 60 } }
    );
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error('Careers fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
