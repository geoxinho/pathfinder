import mongoose, { Schema, model, models } from 'mongoose';

const CareerSchema = new Schema({
  subject: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, default: 'Both' },
  type: { type: String, default: 'Full-Time' },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  deadline: Date,
  status: { type: String, default: 'Open', enum: ['Open', 'Closed', 'Filled'] },
  applicants: [{
    name: String,
    email: String,
    phone: String,
    resumeUrl: String,
    coverLetter: String,
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Career = models.Career || model('Career', CareerSchema);
export default Career;
