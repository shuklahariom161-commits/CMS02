import { initialSeedData } from '../seed/seedData.js';
import { generateId } from '../utils/generateId.js';

let notificationsStore = [...initialSeedData.notifications];

export const notificationService = {
  getNotificationsForUser(userId?: string) {
    return notificationsStore;
  },

  createNotification(notif: {
    title: string;
    message: string;
    type: string;
    link?: string;
    recipientId?: string;
  }) {
    const newNotif = {
      id: generateId('notif'),
      title: notif.title,
      message: notif.message,
      type: notif.type,
      link: notif.link || '',
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    notificationsStore.unshift(newNotif as any);
    return newNotif;
  },

  markAsRead(id: string) {
    notificationsStore = notificationsStore.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    return true;
  },
};
