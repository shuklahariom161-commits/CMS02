import mongoose, { Schema, Document } from 'mongoose';

export interface IFacultyPost extends Document {
  title: string;
  content: string;
  image?: string;
  category: string;
  facultyId: mongoose.Types.ObjectId;
  facultyName: string;
  department: string;
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FacultyPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, default: 'General Announcement' },
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    facultyName: { type: String, required: true },
    department: { type: String, default: '' },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FacultyPost = mongoose.models.FacultyPost || mongoose.model<IFacultyPost>('FacultyPost', FacultyPostSchema);
