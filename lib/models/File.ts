import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFile extends Document {
  name: string;
  description?: string;
  url: string;
  publicId: string;
  fileType: string;
  size?: number;
  category?: string;
  createdAt: Date;
}

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number },
  category: { type: String },
}, { timestamps: true });

const File: Model<IFile> =
  mongoose.models.File || mongoose.model<IFile>('File', FileSchema);

export default File;
