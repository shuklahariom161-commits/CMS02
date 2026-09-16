import { Router } from 'express';
import { login, register, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, getCurrentUser);

// Stubs for forgot/reset password
router.post('/forgot-password', (req, res) => {
  res.json({
    success: true,
    message: 'If an account exists with this college email, instructions have been sent.',
  });
});

router.post('/reset-password', (req, res) => {
  res.json({ success: true, message: 'Password has been successfully updated.' });
});

export default router;
