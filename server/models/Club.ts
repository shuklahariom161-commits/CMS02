import mongoose, { Schema, Document } from 'mongoose';

export enum ClubCategory {
  TECHNICAL = 'Technical',
  CULTURAL = 'Cultural',
  SPORTS = 'Sports',
  LITERARY = 'Literary',
  SOCIAL = 'Social',
  OTHER = 'Other',
}

export interface IClub extends Document {
  name: string;
  code: string;
  tagline: string;
  description: string;
  category: ClubCategory;
  logo: string;
  banner: string;
  presidentId?: mongoose.Types.ObjectId;
  facultyAdvisor?: string;
  email: string;
  website?: string;
  memberCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClubSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(ClubCategory),
      default: ClubCategory.TECHNICAL,
      required: true,
    },
    logo: { type: String, default: '' },
    banner: { type: String, default: '' },
    presidentId: { type: Schema.Types.ObjectId, ref: 'User' },
    facultyAdvisor: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    memberCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Club = mongoose.models.Club || mongoose.model<IClub>('Club', ClubSchema);
