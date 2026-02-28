import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

// Middleware to check if user has required role
export const requireRole = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${roles.join(' or ')}`,
        });
      }

      // Update user info in request
      req.user.role = user.role;
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };
};

// Middleware to require authentication
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login.',
    });
  }
  next();
};