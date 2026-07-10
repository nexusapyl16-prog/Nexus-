import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getHealthData, recordHealth } from '../controllers/healthController.js';

const router = express.Router();

router.get('/', authenticate, getHealthData);
router.post('/', authenticate, recordHealth);

export default router;
