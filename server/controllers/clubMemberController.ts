import { Request, Response } from 'express';
import { store } from '../data/store.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getClubMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clubId, userId } = req.query;
    let results = [...store.clubMembers];

    if (clubId) {
      results = results.filter((m) => m.clubId === clubId);
    }
    if (userId) {
      results = results.filter((m) => m.userId === userId);
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addClubMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { clubId, userId, studentName, studentEmail, position, permissions } = req.body;

    if (!clubId || !userId || !position) {
      res.status(400).json({ success: false, message: 'ClubId, userId, and position are required.' });
      return;
    }

    const existing = store.clubMembers.find((m) => m.clubId === clubId && m.userId === userId);
    if (existing) {
      res.status(400).json({ success: false, message: 'Student is already a registered member of this club.' });
      return;
    }

    const defaultPermissions = {
      canCreateEvents: position === 'President' || position === 'Event Coordinator' || position === 'Technical Head',
      canEditEvents: position === 'President' || position === 'Event Coordinator',
      canDeleteEvents: position === 'President',
      canManageHiring: position === 'President' || position === 'Management Team',
      canManageMembers: position === 'President',
      canPostAchievements: position !== 'Normal Member',
    };

    const newMember = {
      id: generateId('cm'),
      clubId,
      userId,
      studentName: studentName || 'Student Member',
      studentEmail: studentEmail || '',
      position,
      permissions: permissions || defaultPermissions,
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
    };

    store.clubMembers.push(newMember);

    // Update club memberCount
    const club = store.clubs.find((c) => c.id === clubId);
    if (club) {
      club.memberCount = (club.memberCount || 0) + 1;
    }

    res.status(201).json({ success: true, data: newMember, message: 'Member added to club successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClubMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const index = store.clubMembers.findIndex((m) => m.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Member record not found' });
      return;
    }

    store.clubMembers[index] = { ...store.clubMembers[index], ...req.body };
    res.json({ success: true, data: store.clubMembers[index], message: 'Member updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeClubMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const member = store.clubMembers.find((m) => m.id === id);

    if (!member) {
      res.status(404).json({ success: false, message: 'Member record not found' });
      return;
    }

    store.clubMembers = store.clubMembers.filter((m) => m.id !== id);

    const club = store.clubs.find((c) => c.id === member.clubId);
    if (club && club.memberCount > 0) {
      club.memberCount -= 1;
    }

    res.json({ success: true, message: 'Member removed from club' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
