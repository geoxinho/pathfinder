import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface AdmissionData {
  surname: string;
  otherNames: string;
  levelOfSchooling?: string;
  paymentReference?: string;
  parentEmail?: string;
  email?: string;
  examDate?: string;
  [key: string]: any;
}

function formatDate(d: string) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function row(label: string, value: any) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#64748b;width:40%;border-bottom:1px solid #f1f5f9;">${label}</td>
      <td style="padding:8px 12px;font-size:13px;color:#0f172a;font-weight:600;border-bottom:1px solid #f1f5f9;">${value}</td>
    </tr>`;
}

function buildAdminEmail(data: AdmissionData, level: string) {
  const fullName = `${data.surname} ${data.otherNames}`;
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',sans-serif;">
    <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:32px;text-align:center;">
        <div style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:12px;padding:10px 20px;margin-bottom:12px;">
          <span style="color:#fff;font-size:14px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;">Pathfinder College</span>
        </div>
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">New Admission Application</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">${level} School — ${formatDate(new Date().toISOString())}</p>
      </div>

      <!-- Body -->
      <div style="padding:24px;">
        <div style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
          <p style="margin:0;font-size:14px;color:#92400e;font-weight:700;">📋 New application received from <strong>${fullName}</strong></p>
          ${data.paymentReference ? `<p style="margin:6px 0 0;font-size:12px;color:#78350f;">Reference: <strong>${data.paymentReference}</strong></p>` : ''}
        </div>

        <h2 style="font-size:14px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Student Details</h2>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden;">
          ${row('Full Name', fullName)}
          ${row('Level', level + ' School')}
          ${row('Date of Birth', formatDate(data.dateOfBirth))}
          ${row('Sex', data.sex)}
          ${row('Nationality', data.nationality)}
          ${row('State / LGA', `${data.state || ''} / ${data.lga || ''}`)}
          ${row('Religion', data.religion)}
          ${row('Exam Date', data.examDate)}
          ${row('Payment Status', data.paymentStatus)}
          ${row('Payment Ref', data.paymentReference)}
        </table>

        <h2 style="font-size:14px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.08em;margin:20px 0 12px;">Parent / Guardian</h2>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden;">
          ${row('Parent Name', `${data.parentSurname || ''} ${data.parentOtherNames || ''}`)}
          ${row('Occupation', data.parentsOccupation)}
          ${row('Father Phone', data.fatherPhone)}
          ${row('Mother Phone', data.motherPhone)}
          ${row('Parent Email', data.parentEmail || data.email)}
          ${row('Emergency Contact', data.contactPerson)}
        </table>

        <div style="margin-top:24px;padding:14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;text-align:center;">
          <p style="margin:0;font-size:13px;color:#166534;font-weight:600;">✅ This application has been saved to the admin dashboard.</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="margin:0;font-size:11px;color:#94a3b8;">Pathfinder College, Samonda, Ibadan · Admissions Portal</p>
      </div>
    </div>
  </body>
  </html>`;
}

function buildApplicantEmail(data: AdmissionData, level: string) {
  const fullName = `${data.surname} ${data.otherNames}`;
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',sans-serif;">
    <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:40px 32px;text-align:center;">
        <div style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:12px;padding:10px 20px;margin-bottom:16px;">
          <span style="color:#fff;font-size:14px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;">Pathfinder College</span>
        </div>
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;">Application Received! 🎉</h1>
        <p style="margin:10px 0 0;color:rgba(255,255,255,0.7);font-size:14px;">Thank you for applying to Pathfinder College</p>
      </div>

      <!-- Body -->
      <div style="padding:32px;">
        <p style="font-size:16px;color:#0f172a;margin:0 0 8px;">Dear <strong>${fullName}</strong>,</p>
        <p style="font-size:14px;color:#64748b;line-height:1.7;margin:0 0 24px;">
          We have successfully received your application for admission into the 
          <strong style="color:#0f172a;">${level} School</strong> at Pathfinder College. 
          Our admissions team will review your application and get back to you soon.
        </p>

        <!-- Reference Box -->
        ${data.paymentReference ? `
        <div style="background:linear-gradient(135deg,#fefce8,#fef9c3);border:2px solid #fde68a;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#92400e;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">Application Reference Number</p>
          <p style="margin:0;font-size:22px;color:#78350f;font-weight:800;letter-spacing:0.05em;">${data.paymentReference}</p>
          <p style="margin:6px 0 0;font-size:11px;color:#a16207;">Please keep this for your records</p>
        </div>` : ''}

        <!-- Summary -->
        <h2 style="font-size:13px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Application Summary</h2>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden;">
          ${row('Full Name', fullName)}
          ${row('School Level', level + ' School')}
          ${row('Exam Date', data.examDate || 'To be communicated')}
          ${row('Submission Date', formatDate(new Date().toISOString()))}
        </table>

        <!-- What's Next -->
        <div style="margin:24px 0;background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;">
          <h3 style="margin:0 0 12px;font-size:14px;font-weight:800;color:#1e40af;">📌 What Happens Next?</h3>
          <ol style="margin:0;padding-left:20px;font-size:13px;color:#1e40af;line-height:1.8;">
            <li>Our admissions office will review your application.</li>
            <li>You will be contacted with your exam schedule and venue.</li>
            <li>Attend the entrance examination on the confirmed date.</li>
            <li>Results and admission letters will be communicated directly.</li>
          </ol>
        </div>

        <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
          If you have any questions, please contact us at 
          <a href="mailto:${process.env.EMAIL_TO || process.env.EMAIL_USER}" style="color:#f59e0b;font-weight:600;">${process.env.EMAIL_TO || process.env.EMAIL_USER}</a>
          or visit us at Samonda, Ibadan.
        </p>

        <p style="font-size:14px;color:#0f172a;margin:24px 0 0;">
          Warm regards,<br>
          <strong>The Admissions Office</strong><br>
          <span style="color:#64748b;font-size:13px;">Pathfinder College, Ibadan</span>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="margin:0;font-size:11px;color:#94a3b8;">© ${new Date().getFullYear()} Pathfinder College, Samonda, Ibadan · All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;
}

export async function sendAdmissionEmails(data: AdmissionData, level: 'Junior' | 'Senior') {
  const adminEmail = process.env.EMAIL_TO || process.env.EMAIL_USER;
  const applicantEmail = data.parentEmail || data.email;
  const fullName = `${data.surname} ${data.otherNames}`;
  const subject = `New ${level} School Application — ${fullName}`;
  const applicantSubject = `Application Received — Pathfinder College (${level} School)`;

  const results: string[] = [];

  try {
    // Send to admin
    await transporter.sendMail({
      from: `"Pathfinder College Admissions" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject,
      html: buildAdminEmail(data, level),
    });
    results.push('admin_sent');
  } catch (err) {
    console.error('[Email] Failed to send admin notification:', err);
    results.push('admin_failed');
  }

  if (applicantEmail) {
    try {
      // Send to applicant/parent
      await transporter.sendMail({
        from: `"Pathfinder College Admissions" <${process.env.EMAIL_USER}>`,
        to: applicantEmail,
        subject: applicantSubject,
        html: buildApplicantEmail(data, level),
      });
      results.push('applicant_sent');
    } catch (err) {
      console.error('[Email] Failed to send applicant confirmation:', err);
      results.push('applicant_failed');
    }
  } else {
    results.push('no_applicant_email');
  }

  return results;
}
