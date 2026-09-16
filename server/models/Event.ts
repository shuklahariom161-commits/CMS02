import mongoose, { Schema, Document } from 'mongoose';

export enum EventCategory {
  TECHNICAL = 'Technical',
  CULTURAL = 'Cultural',
  SPORTS = 'Sports',
  WORKSHOP = 'Workshop',
  COMPETITION = 'Competition',
  SEMINAR = 'Seminar',
  OTHER = 'Other',
}

export interface IEvent extends Document {
  title: string;
  description: string;
  poster: string;
  date: string;
  time: string;
  venue: string;
  registrationLink: string;
  category: EventCategory;
  tags: string[];
  clubId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    poster: { type: String, default: '' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    registrationLink: { type: String, default: '' },
    category: {
      type: String,
      enum: Object.values(EventCategory),
      default: EventCategory.TECHNICAL,
      required: true,
    },
    tags: [{ type: String, trim: true }],
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
