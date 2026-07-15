import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Chairman', 'Leadership', 'Department'] 
  },
  role: { type: String },
  sub: { type: String },
  department: { type: String }, // Used when category is 'Department'
  img: { type: String },
  bio: { type: String },
  badge: { type: String },
  badgeColor: { type: String },
  featured: { type: Boolean, default: false },
  qual: { type: String }, // Qualifications
  initials: { type: String }, // Initials if no image is available
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
