import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/generateToken.js';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access Denied: No authentication token provided.',
    });
    return;
  }

  const verified = verifyToken(token);
  if (!verified) {
    res.status(403).json({
      success: false,
      message: 'Access Denied: Invalid or expired token.',
    });
    return;
  }

  req.user = verified;
  next();
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    const verified = verifyToken(token);
    if (verified) {
      req.user = verified;
    }
  }
  next();
};
