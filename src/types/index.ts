export type UserRole = 'STUDENT' | 'FACULTY' | 'CLUB_MANAGEMENT' | 'ADMIN';

export interface ClubMembership {
  id: string;
  clubId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  position: string;
  permissions: {
    canCreateEvents: boolean;
    canEditEvents: boolean;
    canDeleteEvents: boolean;
    canManageHiring: boolean;
    canManageMembers: boolean;
    canPostAchievements: boolean;
  };
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ALUMNI';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  designation?: string;
  phone?: string;
  cabin?: string;
  qualification?: string;
  specialization?: string[];
  bio?: string;
  advisedClubs?: string[];
  year?: string;
  studentId?: string;
  facultyId?: string;
  avatar?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  blockReason?: string;
  blockedAt?: string;
  clubMemberships?: ClubMembership[];
}

export interface Club {
  id: string;
  name: string;
  code: string;
  tagline: string;
  description: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Literary' | 'Social' | 'Professional Society' | 'Other';
  logo: string;
  banner: string;
  facultyAdvisor?: string;
  email?: string;
  website?: string;
  memberCount: number;
  isActive: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
  restrictedAt?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  poster: string;
  date: string;
  time: string;
  venue: string;
  registrationLink?: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Competition' | 'Seminar' | 'Other';
  tags: string[];
  clubId: string;
  clubName: string;
  isPublished?: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
  restrictedAt?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'COLLEGE' | 'STUDENT' | 'CLUB';
  date: string;
  studentName?: string;
  department?: string;
  year?: string;
  clubName?: string;
  isApproved?: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
  restrictedAt?: string;
}

export interface HiringItem {
  id: string;
  clubId: string;
  clubName: string;
  position: string;
  description: string;
  eligibility: string;
  requiredSkills: string[];
  deadline: string;
  poster: string;
  applicationLink: string;
  status: 'OPEN' | 'CLOSED';
  isRestricted?: boolean;
  restrictionReason?: string;
  restrictedAt?: string;
}

export interface FacultyPostItem {
  id: string;
  title: string;
  content: string;
  category: string;
  postType?: 'HACKATHON' | 'NOTICE' | 'LINK' | 'GENERAL';
  facultyId: string;
  facultyName: string;
  department: string;
  image?: string;
  link?: string;
  deadline?: string;
  prizePool?: string;
  likesCount: number;
  commentsCount: number;
  isPinned?: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
  restrictedAt?: string;
  createdAt: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: 'FACULTY' | 'STUDENT';
  senderAvatar: string;
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  timestamp: string;
}

export interface StudentGroup {
  id: string;
  name: string;
  description: string;
  facultyId: string;
  facultyName: string;
  department: string;
  memberCount: number;
  avatar: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  students: {
    id: string;
    name: string;
    enrollment: string;
    avatar: string;
  }[];
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: 'Head of Department (HOD)' | 'Professor & HOD' | 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Dean & Senior Professor' | 'Associate Professor & Dean' | string;
  department: string;
  email: string;
  phone?: string;
  cabin: string;
  qualification: string;
  specialization: string[];
  avatar: string;
  joiningYear?: string;
  advisedClubs?: string[];
  bio?: string;
  isRestricted?: boolean;
  restrictionReason?: string;
  restrictedAt?: string;
}

export interface CommentItem {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  createdAt: string;
  isRestricted?: boolean;
  restrictionReason?: string;
  postTitle?: string;
  postCategory?: string;
}

export interface ActivityLogItem {
  id: string;
  actionType:
    | 'RESTRICT_CLUB'
    | 'UNBLOCK_CLUB'
    | 'BLOCK_STUDENT'
    | 'UNBLOCK_STUDENT'
    | 'RESTRICT_FACULTY'
    | 'UNBLOCK_FACULTY'
    | 'RESTRICT_POST'
    | 'UNBLOCK_POST'
    | 'RESTRICT_EVENT'
    | 'UNBLOCK_EVENT'
    | 'DELETE_COMMENT'
    | 'RESTRICT_COMMENT'
    | 'UNBLOCK_COMMENT'
    | 'RESTRICT_HIRING'
    | 'UNBLOCK_HIRING';
  targetType: 'CLUB' | 'STUDENT' | 'FACULTY' | 'POST' | 'EVENT' | 'COMMENT' | 'HIRING';
  targetId: string;
  targetName: string;
  reason: string;
  adminName: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
