import { Router } from 'express';
import { toggleLike, getPostLikes } from '../controllers/likeController.js';
import { optionalAuth, authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:postId', optionalAuth, getPostLikes);
router.post('/:postId', authenticateToken, toggleLike);

export default router;
