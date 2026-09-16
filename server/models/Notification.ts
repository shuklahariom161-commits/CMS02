import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  NEW_EVENT = 'NEW_EVENT',
  NEW_HIRING = 'NEW_HIRING',
  NEW_FACULTY_POST = 'NEW_FACULTY_POST',
  CLUB_MEMBERSHIP = 'CLUB_MEMBERSHIP',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

export interface INotification extends Document {
  recipientId?: mongoose.Types.ObjectId; // null for broadcast
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.ANNOUNCEMENT,
    },
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
