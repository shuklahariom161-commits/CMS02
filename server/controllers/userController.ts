import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, search } = req.query;
    let results = [...store.users];

    if (role && role !== 'ALL') {
      results = results.filter((u) => u.role.toUpperCase() === (role as string).toUpperCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          ((u as any).department && (u as any).department.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = store.users.find((u) => u.id === id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const clubMemberships = store.clubMembers.filter((cm) => cm.userId === user.id);
    res.json({ success: true, data: { ...user, clubMemberships } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.users.findIndex((u) => u.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    store.users[index] = { ...store.users[index], ...req.body };
    res.json({ success: true, data: store.users[index], message: 'User updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    store.users = store.users.filter((u) => u.id !== id);
    store.clubMembers = store.clubMembers.filter((m) => m.userId !== id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
