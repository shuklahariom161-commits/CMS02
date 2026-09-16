import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, clubId, search } = req.query;
    let results = [...store.events];

    if (category && category !== 'All') {
      results = results.filter((e) => e.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (clubId) {
      results = results.filter((e) => e.clubId === clubId);
    }

    if (search) {
      const q = (search as string).toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.clubName.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = store.events.find((e) => e.id === id);

    if (!event) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, poster, date, time, venue, registrationLink, category, tags, clubId } = req.body;

    if (!title || !date || !time || !venue || !clubId) {
      res.status(400).json({ success: false, message: 'Title, date, time, venue, and clubId are required.' });
      return;
    }

    const club = store.clubs.find((c) => c.id === clubId);
    const clubName = club ? club.name : 'College Club';

    const newEvent = {
      id: generateId('evt'),
      title,
      description,
      poster: poster || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      date,
      time,
      venue,
      registrationLink: registrationLink || '',
      category: category || 'Technical',
      tags: Array.isArray(tags) ? tags : ['College', 'Event'],
      clubId,
      clubName,
      isPublished: true,
    };

    store.events.unshift(newEvent);
    res.status(201).json({ success: true, data: newEvent, message: 'Event created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.events.findIndex((e) => e.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Event not found' });
      return;
    }

    store.events[index] = { ...store.events[index], ...req.body };
    res.json({ success: true, data: store.events[index], message: 'Event updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    store.events = store.events.filter((e) => e.id !== id);
    res.json({ success: true, message: 'Event removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
