import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  CLUB_MANAGEMENT = 'CLUB_MANAGEMENT',
  ADMIN = 'ADMIN',
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  studentId?: string;
  facultyId?: string;
  department?: string;
  year?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
      required: true,
    },
    studentId: { type: String, trim: true },
    facultyId: { type: String, trim: true },
    department: { type: String, trim: true },
    year: { type: String, trim: true },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
