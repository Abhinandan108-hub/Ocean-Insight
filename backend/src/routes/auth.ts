import { Router } from 'express';
import { login, signup, protectedTest } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/protected', authMiddleware, protectedTest);

export default router;
