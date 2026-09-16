import { Router } from 'express';
import { getClubs, getClubById, createClub, updateClub, deleteClub } from '../controllers/clubController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/', getClubs);
router.get('/:id', getClubById);
router.post('/', authenticateToken, requireAdmin, createClub);
router.put('/:id', authenticateToken, updateClub);
router.delete('/:id', authenticateToken, requireAdmin, deleteClub);

export default router;
