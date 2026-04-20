import { NextResponse } from 'next/server';
import { writeClient } from '@/lib/sanity';

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete admission error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
