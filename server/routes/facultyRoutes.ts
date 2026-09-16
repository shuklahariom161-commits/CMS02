import { Router } from 'express';
import { getFaculty, getFacultyById } from '../controllers/facultyController.js';

const router = Router();

router.get('/', getFaculty);
router.get('/:id', getFacultyById);

export default router;
