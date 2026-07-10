import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getTransactions, addTransaction, getStats } from '../controllers/financeController.js';

const router = express.Router();

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, addTransaction);
router.get('/stats', authenticate, getStats);

export default router;
