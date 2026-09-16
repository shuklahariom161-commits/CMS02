import { Router } from 'express';
import {
  getClubMembers,
  addClubMember,
  updateClubMember,
  removeClubMember,
} from '../controllers/clubMemberController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getClubMembers);
router.post('/', authenticateToken, addClubMember);
router.put('/:id', authenticateToken, updateClubMember);
router.delete('/:id', authenticateToken, removeClubMember);

export default router;
