import mongoose, { Schema, Document } from 'mongoose';

export interface IHiring extends Document {
  clubId: mongoose.Types.ObjectId;
  position: string;
  description: string;
  eligibility: string;
  requiredSkills: string[];
  deadline: string;
  poster: string;
  applicationLink: string;
  status: 'OPEN' | 'CLOSED';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HiringSchema: Schema = new Schema(
  {
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    position: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    requiredSkills: [{ type: String, trim: true }],
    deadline: { type: String, required: true },
    poster: { type: String, default: '' },
    applicationLink: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'CLOSED'],
      default: 'OPEN',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Hiring = mongoose.models.Hiring || mongoose.model<IHiring>('Hiring', HiringSchema);
