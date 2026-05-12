import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/lib/models/Contact';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(contacts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    // Save to database
    const contact = await Contact.create({ name, email, phone, subject, message });

    // Send email notification
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Pathfinder College Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject || 'No Subject'} — from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background: #1a3a5c; padding: 20px; border-radius: 6px 6px 0 0; text-align: center;">
            <h1 style="color: #f0a500; margin: 0; font-size: 22px;">New Contact Message</h1>
            <p style="color: #ffffff; margin: 6px 0 0 0; font-size: 14px;">Pathfinder College Website</p>
          </div>
          <div style="padding: 24px;">
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #1a3a5c; width: 120px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${name}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #1a3a5c;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${email}">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #1a3a5c;">Phone</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${phone}</td></tr>` : ''}
              ${subject ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #1a3a5c;">Subject</td><td style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;">${subject}</td></tr>` : ''}
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 6px; border-left: 4px solid #f0a500;">
              <p style="font-weight: bold; color: #1a3a5c; margin: 0 0 8px 0;">Message:</p>
              <p style="color: #555; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your Inquiry')}" 
                 style="background: #1a3a5c; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-size: 14px;">
                Reply to ${name}
              </a>
            </div>
          </div>
          <div style="text-align: center; padding: 12px; background: #f5f5f5; border-radius: 0 0 6px 6px; font-size: 12px; color: #999;">
            Received on ${new Date().toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })}
          </div>
        </div>
      `,
    }).catch((err) => {
      console.error('Email send failed (non-fatal):', err.message);
    });

    return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to process contact' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, read } = await req.json();
    await Contact.findByIdAndUpdate(id, { read });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
