import express from 'express';
import { register, login, loginWithGoogle, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', loginWithGoogle);
router.post('/logout', logout);

export default router;
