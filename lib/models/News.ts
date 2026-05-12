import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INews extends Document {
  title: string;
  slug: string;
  excerpt?: string;
  body: string; // HTML from Tiptap
  coverImage?: string;
  coverImagePublicId?: string;
  category?: string;
  author?: string;
  publishedAt: Date;
  createdAt: Date;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  body: { type: String, default: '' },
  coverImage: { type: String },
  coverImagePublicId: { type: String },
  category: { type: String },
  author: { type: String },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const News: Model<INews> =
  mongoose.models.News || mongoose.model<INews>('News', NewsSchema);

export default News;
