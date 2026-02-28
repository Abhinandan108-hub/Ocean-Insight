import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/user';
import PasswordResetModel from '../models/passwordReset';
import { generateRandomToken } from '../utils/responseFormatter';
import emailService from '../services/emailService';

// extend express request with a user field added by auth middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string; role?: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Generate both access and refresh tokens
const generateTokens = (user: IUser) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = await UserModel.create({
      name,
      email,
      password: hashed,
      role: 'User',
    });

    // Send welcome email
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    await emailService.sendWelcomeEmail(email, name, loginUrl);

    const { accessToken, refreshToken } = generateTokens(created);

    const userPayload = {
      id: created.id,
      name: created.name,
      email: created.email,
      role: created.role,
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userPayload,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userPayload,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
      const user = await UserModel.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
      res.json({
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link will be sent.',
      });
    }

    // Generate reset token
    const resetToken = generateRandomToken(32);
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await PasswordResetModel.create({
      userId: user.id,
      token: resetToken,
      expiresAt,
    });

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(email, resetLink);

    res.json({
      success: true,
      message: 'Password reset link sent to your email',
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required',
      });
    }

    const resetRecord = await PasswordResetModel.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!resetRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    const user = await UserModel.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    // Mark token as used
    resetRecord.used = true;
    await resetRecord.save();

    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await UserModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User profile retrieved',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// note: middleware attaches `user` property, so use AuthRequest type
export const protectedTest = (req: AuthRequest, res: Response): Response => {
  return res.json({
    success: true,
    message: 'You accessed a protected route',
    data: { user: req.user },
  });
};
