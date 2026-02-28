import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';
import ResourceModel from '../models/resource';
import EventModel from '../models/event';
import LogModel from '../models/log';
import { parsePaginationParams, calculateSkip, buildPaginatedResponse } from '../utils/pagination';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role?: string };
}

// Dashboard statistics
export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalResources = await ResourceModel.countDocuments();
    const totalEvents = await EventModel.countDocuments();
    const publishedResources = await ResourceModel.countDocuments({ isPublished: true });
    const activeUsers = await UserModel.countDocuments({ isActive: true });

    // Recent activity
    const recentLogs = await LogModel.find().sort({ createdAt: -1 }).limit(10);
    const recentUsers = await UserModel.find().sort({ createdAt: -1 }).limit(5);
    const recentResources = await ResourceModel.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      message: 'Dashboard statistics',
      data: {
        stats: {
          totalUsers,
          totalResources,
          publishedResources,
          totalEvents,
          activeUsers,
        },
        recentActivity: {
          logs: recentLogs,
          users: recentUsers,
          resources: recentResources,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Manage users
export const getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    const filter: any = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
    const skip = calculateSkip(pageNum, limitNum);

    const total = await UserModel.countDocuments(filter);
    const users = await UserModel.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      message: 'Users retrieved',
      data: buildPaginatedResponse(users, pageNum, limitNum, total),
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['Admin', 'Educator', 'User'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User role updated',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const deactivateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deactivated',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// Manage resources
export const getAllResources = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, isPublished } = req.query;

    const filter: any = {};
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
    const skip = calculateSkip(pageNum, limitNum);

    const total = await ResourceModel.countDocuments(filter);
    const resources = await ResourceModel.find(filter)
      .skip(skip)
      .limit(limitNum)
      .populate('author', 'name email');

    res.json({
      success: true,
      message: 'Resources retrieved',
      data: buildPaginatedResponse(resources, pageNum, limitNum, total),
    });
  } catch (err) {
    next(err);
  }
};

export const publishResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { resourceId } = req.params;

    const resource = await ResourceModel.findByIdAndUpdate(
      resourceId,
      { isPublished: true },
      { new: true }
    ).populate('author', 'name email');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.json({
      success: true,
      message: 'Resource published',
      data: resource,
    });
  } catch (err) {
    next(err);
  }
};

export const unpublishResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { resourceId } = req.params;

    const resource = await ResourceModel.findByIdAndUpdate(
      resourceId,
      { isPublished: false },
      { new: true }
    ).populate('author', 'name email');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.json({
      success: true,
      message: 'Resource unpublished',
      data: resource,
    });
  } catch (err) {
    next(err);
  }
};

// View logs
export const getLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, level, userId } = req.query;

    const filter: any = {};
    if (level) filter.level = level;
    if (userId) filter.userId = userId;

    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
    const skip = calculateSkip(pageNum, limitNum);

    const total = await LogModel.countDocuments(filter);
    const logs = await LogModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('userId', 'name email');

    res.json({
      success: true,
      message: 'Logs retrieved',
      data: buildPaginatedResponse(logs, pageNum, limitNum, total),
    });
  } catch (err) {
    next(err);
  }
};