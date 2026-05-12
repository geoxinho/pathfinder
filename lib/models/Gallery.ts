import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGalleryImage {
  url: string;
  publicId: string;
}

export interface IGallery extends Document {
  title: string;
  subtitle?: string;
  images: IGalleryImage[];
  publishedAt: Date;
  createdAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
});

const GallerySchema = new Schema<IGallery>({
  title: { type: String, required: true },
  subtitle: { type: String },
  images: [GalleryImageSchema],
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);

export default Gallery;
