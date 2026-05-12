import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  eventDate: Date;
  location?: string;
  category?: string;
  featured: boolean;
  image?: string;
  imagePublicId?: string;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  eventDate: { type: Date, required: true },
  location: { type: String },
  category: { type: String },
  featured: { type: Boolean, default: false },
  image: { type: String },
  imagePublicId: { type: String },
}, { timestamps: true });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
