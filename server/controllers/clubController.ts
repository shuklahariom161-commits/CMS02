import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getClubs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    let results = [...store.clubs];

    if (category && category !== 'All') {
      results = results.filter((c) => c.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClubById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const club = store.clubs.find((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase());

    if (!club) {
      res.status(404).json({ success: false, message: 'Club not found' });
      return;
    }

    const members = store.clubMembers.filter((m) => m.clubId === club.id);
    const events = store.events.filter((e) => e.clubId === club.id);
    const hiring = store.hiring.filter((h) => h.clubId === club.id);
    const achievements = store.achievements.filter((a) => a.category === 'CLUB' && (a.clubName === club.name || (a as any).clubId === club.id));

    res.json({
      success: true,
      data: {
        ...club,
        members,
        events,
        hiring,
        achievements,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, tagline, description, category, logo, banner, email, facultyAdvisor } = req.body;

    if (!name || !code || !description) {
      res.status(400).json({ success: false, message: 'Club name, unique code, and description are required.' });
      return;
    }

    const newClub = {
      id: generateId('club'),
      name,
      code: code.toUpperCase(),
      tagline: tagline || '',
      description,
      category: category || 'Technical',
      logo: logo || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=200&auto=format&fit=crop&q=80',
      banner: banner || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
      email: email || `${code.toLowerCase()}@college.edu`,
      facultyAdvisor: facultyAdvisor || '',
      memberCount: 1,
      isActive: true,
    };

    store.clubs.push(newClub);
    res.status(201).json({ success: true, data: newClub, message: 'Club created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.clubs.findIndex((c) => c.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Club not found' });
      return;
    }

    store.clubs[index] = { ...store.clubs[index], ...req.body };
    res.json({ success: true, data: store.clubs[index], message: 'Club details updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    store.clubs = store.clubs.filter((c) => c.id !== id);
    res.json({ success: true, message: 'Club removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
