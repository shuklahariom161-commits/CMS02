import { Request, Response, NextFunction } from 'express';

// Lightweight payload validator for image URLs & uploads
export const validateImagePayload = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body && req.body.image) {
    if (typeof req.body.image !== 'string') {
      res.status(400).json({ success: false, message: 'Image must be a valid URL string' });
      return;
    }
  }
  next();
};
