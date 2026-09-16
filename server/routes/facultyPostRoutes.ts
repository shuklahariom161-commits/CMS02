import { Router } from 'express';
import {
  getFacultyPosts,
  createFacultyPost,
  updateFacultyPost,
  deleteFacultyPost,
} from '../controllers/facultyPostController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getFacultyPosts);
router.post('/', authenticateToken, createFacultyPost);
router.put('/:id', authenticateToken, updateFacultyPost);
router.delete('/:id', authenticateToken, deleteFacultyPost);

export default router;
