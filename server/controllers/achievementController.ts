import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getAchievements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    let results = [...store.achievements];

    if (category && category !== 'ALL') {
      results = results.filter((a) => a.category.toUpperCase() === (category as string).toUpperCase());
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, image, category, date, studentName, department, year, clubName } = req.body;

    if (!title || !description || !category || !date) {
      res.status(400).json({ success: false, message: 'Title, description, category, and date are required.' });
      return;
    }

    const newAchievement = {
      id: generateId('ach'),
      title,
      description,
      image: image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
      category: category.toUpperCase(),
      date,
      studentName: studentName || '',
      department: department || '',
      year: year || '',
      clubName: clubName || '',
      isApproved: true,
    };

    store.achievements.unshift(newAchievement as any);
    res.status(201).json({ success: true, data: newAchievement, message: 'Achievement added successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.achievements.findIndex((a) => a.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Achievement not found' });
      return;
    }

    store.achievements[index] = { ...store.achievements[index], ...req.body };
    res.json({ success: true, data: store.achievements[index], message: 'Achievement updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAchievement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    store.achievements = store.achievements.filter((a) => a.id !== id);
    res.json({ success: true, message: 'Achievement deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
