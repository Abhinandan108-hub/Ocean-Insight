import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel, { IUser } from '../models/user';

// extend express request with a user field added by auth middleware
interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

const generateToken = (user: IUser) => {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const created = await UserModel.create({ email, password: hashed });

    const token = generateToken(created);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// note: middleware attaches `user` property, so use AuthRequest type
export const protectedTest = (req: AuthRequest, res: Response): Response => {
  return res.json({
    message: 'You accessed a protected route',
    user: req.user,
  });
};
