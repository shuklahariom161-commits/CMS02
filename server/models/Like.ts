import mongoose, { Schema, Document } from 'mongoose';

export interface ILike extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'FacultyPost', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const Like = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);
