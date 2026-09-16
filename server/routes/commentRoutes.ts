import { Router } from 'express';
import {
  getAllComments,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAllComments);
router.get('/:postId', getCommentsByPost);
router.post('/', authenticateToken, createComment);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;
