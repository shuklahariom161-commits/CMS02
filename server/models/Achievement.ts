import mongoose, { Schema, Document } from 'mongoose';

export enum AchievementCategory {
  COLLEGE = 'COLLEGE',
  STUDENT = 'STUDENT',
  CLUB = 'CLUB',
}

export interface IAchievement extends Document {
  title: string;
  description: string;
  image: string;
  category: AchievementCategory;
  date: string;
  studentName?: string;
  department?: string;
  year?: string;
  clubName?: string;
  clubId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    category: {
      type: String,
      enum: Object.values(AchievementCategory),
      required: true,
    },
    date: { type: String, required: true },
    studentName: { type: String, default: '' },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    clubName: { type: String, default: '' },
    clubId: { type: Schema.Types.ObjectId, ref: 'Club' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Achievement =
  mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);
