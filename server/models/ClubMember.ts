import mongoose, { Schema, Document } from 'mongoose';

export enum ClubPosition {
  PRESIDENT = 'President',
  VICE_PRESIDENT = 'Vice President',
  TECHNICAL_HEAD = 'Technical Head',
  EVENT_COORDINATOR = 'Event Coordinator',
  MANAGEMENT_TEAM = 'Management Team',
  MEMBER = 'Normal Member',
}

export interface IClubMember extends Document {
  clubId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  position: ClubPosition;
  permissions: {
    canCreateEvents: boolean;
    canEditEvents: boolean;
    canDeleteEvents: boolean;
    canManageHiring: boolean;
    canManageMembers: boolean;
    canPostAchievements: boolean;
  };
  joiningDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'ALUMNI';
  createdAt: Date;
  updatedAt: Date;
}

const ClubMemberSchema: Schema = new Schema(
  {
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    position: {
      type: String,
      enum: Object.values(ClubPosition),
      default: ClubPosition.MEMBER,
      required: true,
    },
    permissions: {
      canCreateEvents: { type: Boolean, default: false },
      canEditEvents: { type: Boolean, default: false },
      canDeleteEvents: { type: Boolean, default: false },
      canManageHiring: { type: Boolean, default: false },
      canManageMembers: { type: Boolean, default: false },
      canPostAchievements: { type: Boolean, default: false },
    },
    joiningDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ALUMNI'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

ClubMemberSchema.index({ clubId: 1, userId: 1 }, { unique: true });

export const ClubMember = mongoose.models.ClubMember || mongoose.model<IClubMember>('ClubMember', ClubMemberSchema);
