import { initialSeedData } from '../seed/seedData.js';

// In-memory active repository initialized from seed data
export interface AppDataStore {
  users: typeof initialSeedData.users;
  clubs: typeof initialSeedData.clubs;
  clubMembers: typeof initialSeedData.clubMembers;
  events: typeof initialSeedData.events;
  hiring: typeof initialSeedData.hiring;
  facultyPosts: typeof initialSeedData.facultyPosts;
  achievements: typeof initialSeedData.achievements;
  comments: typeof initialSeedData.comments;
  notifications: typeof initialSeedData.notifications;
  likes: { id: string; postId: string; userId: string; createdAt: string }[];
}

export const store: AppDataStore = {
  users: [...initialSeedData.users],
  clubs: [...initialSeedData.clubs],
  clubMembers: [...initialSeedData.clubMembers],
  events: [...initialSeedData.events],
  hiring: [...initialSeedData.hiring],
  facultyPosts: [...initialSeedData.facultyPosts],
  achievements: [...initialSeedData.achievements],
  comments: [...initialSeedData.comments],
  notifications: [...initialSeedData.notifications],
  likes: [
    { id: 'like_01', postId: 'fpost_01', userId: 'usr_stu_01', createdAt: '2026-09-08T11:00:00.000Z' },
    { id: 'like_02', postId: 'fpost_02', userId: 'usr_stu_02', createdAt: '2026-09-07T15:00:00.000Z' },
  ],
};
