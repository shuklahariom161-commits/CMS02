import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getHiringPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clubId, status } = req.query;
    let results = [...store.hiring];

    if (clubId) {
      results = results.filter((h) => h.clubId === clubId);
    }
    if (status) {
      results = results.filter((h) => h.status === status);
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHiringPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clubId, position, description, eligibility, requiredSkills, deadline, poster, applicationLink } = req.body;

    if (!clubId || !position || !applicationLink || !deadline) {
      res.status(400).json({ success: false, message: 'ClubId, position, applicationLink, and deadline are required.' });
      return;
    }

    const club = store.clubs.find((c) => c.id === clubId);

    const newHiring = {
      id: generateId('hire'),
      clubId,
      clubName: club ? club.name : 'College Club',
      position,
      description: description || '',
      eligibility: eligibility || 'Open to all students',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : ['Teamwork'],
      deadline,
      poster: poster || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
      applicationLink,
      status: 'OPEN',
    };

    store.hiring.unshift(newHiring);
    res.status(201).json({ success: true, data: newHiring, message: 'Opportunity created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHiringPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.hiring.findIndex((h) => h.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Opportunity post not found' });
      return;
    }

    store.hiring[index] = { ...store.hiring[index], ...req.body };
    res.json({ success: true, data: store.hiring[index], message: 'Opportunity updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHiringPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    store.hiring = store.hiring.filter((h) => h.id !== id);
    res.json({ success: true, message: 'Opportunity removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
