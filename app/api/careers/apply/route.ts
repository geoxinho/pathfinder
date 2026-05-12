import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Career from '@/lib/models/Career';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { jobId, fullName, email, phone, highestQualification, yearsOfExperience, cvLink, coverLetter } = body;

    if (!jobId) {
      // General application
      // Handle accordingly if needed, or just find a generic job entry
    }

    // Add applicant to the career entry
    const job = await Career.findById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    job.applicants.push({
      name: fullName,
      email,
      phone,
      resumeUrl: cvLink,
      coverLetter,
      appliedAt: new Date()
    });

    await job.save();

    // Send email notification to school
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Career Application: ${job.subject} Teacher`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #0E539C;">New Teacher Application</h2>
          <p><strong>Position:</strong> ${job.subject} Teacher</p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Qualification:</strong> ${highestQualification}</p>
          <p><strong>Experience:</strong> ${yearsOfExperience}</p>
          <p><strong>CV Link:</strong> <a href="${cvLink}">${cvLink}</a></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
            <p><strong>Cover Letter:</strong></p>
            <p style="white-space: pre-wrap;">${coverLetter}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Career application error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
