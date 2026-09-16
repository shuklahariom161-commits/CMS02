import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware.js';

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' does not have sufficient permissions. Required: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN']);
export const requireFaculty = requireRole(['FACULTY', 'ADMIN']);
export const requireClubOrAdmin = requireRole(['CLUB_MANAGEMENT', 'ADMIN']);
