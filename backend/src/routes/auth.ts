import { Router } from 'express';
import {
  signup,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  me,
  protectedTest,
} from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validation';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from '../validations/authValidation';
import { authLimiter, emailLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/register', authLimiter, validateRequest(registerSchema), signup);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshTokenSchema), refreshToken);
router.post('/forgot-password', emailLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

// Protected routes
router.get('/me', authMiddleware, me);
router.get('/protected', authMiddleware, protectedTest);

export default router;
