import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { store } from '../data/store.js';
import { generateToken } from '../utils/generateToken.js';
import { isCollegeEmail, validatePasswordStrength } from '../utils/validators.js';
import { generateId } from '../utils/generateId.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = store.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid college email or credentials.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Your account has been deactivated by the college administration.' });
      return;
    }

    // Check user club memberships
    const userClubMemberships = store.clubMembers.filter((cm) => cm.userId === user.id);

    // Create token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: (user as any).department,
        year: (user as any).year,
        studentId: (user as any).studentId,
        facultyId: (user as any).facultyId,
        avatar: user.avatar,
        clubMemberships: userClubMemberships,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role = 'STUDENT', department, year, studentId } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing
    const existing = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this college email already exists.' });
      return;
    }

    const passCheck = validatePasswordStrength(password);
    if (!passCheck.isValid) {
      res.status(400).json({ success: false, message: passCheck.message });
      return;
    }

    const newUser = {
      id: generateId('usr_stu'),
      name: name.trim(),
      email: cleanEmail,
      role: role.toUpperCase(),
      studentId: studentId || `STU-${Date.now().toString().slice(-4)}`,
      department: department || 'General Engineering',
      year: year || '1st Year',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      isActive: true,
    };

    store.users.push(newUser);

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    res.status(201).json({
      success: true,
      message: 'Registration completed successfully',
      token,
      user: {
        ...newUser,
        clubMemberships: [],
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = store.users.find((u) => u.id === req.user?.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const userClubMemberships = store.clubMembers.filter((cm) => cm.userId === user.id);

    res.json({
      success: true,
      user: {
        ...user,
        clubMemberships: userClubMemberships,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
