import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getGoals, createGoal, updateGoal } from '../controllers/goalsController.js';

const router = express.Router();

router.get('/', authenticate, getGoals);
router.post('/', authenticate, createGoal);
router.put('/:id', authenticate, updateGoal);

export default router;
