import { Router } from 'express';
import {
  getHiringPosts,
  createHiringPost,
  updateHiringPost,
  deleteHiringPost,
} from '../controllers/hiringController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getHiringPosts);
router.post('/', authenticateToken, createHiringPost);
router.put('/:id', authenticateToken, updateHiringPost);
router.delete('/:id', authenticateToken, deleteHiringPost);

export default router;
