import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await connectDB();
    
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return NextResponse.json({ message: 'Admin already initialized' }, { status: 400 });
    }

    const defaultPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPasscode, 10);

    const newAdmin = await User.create({
      name: 'System Admin',
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin account created successfully',
      username: 'admin',
      password: ' (same as your previous passcode) '
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
