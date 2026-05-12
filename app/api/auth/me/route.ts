import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me');

export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        name: payload.name, 
        role: payload.role, 
        username: payload.username 
      } 
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}
