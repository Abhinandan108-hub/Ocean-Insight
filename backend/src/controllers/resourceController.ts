import { Request, Response, NextFunction } from 'express';
import ResourceModel, { IResource } from '../models/resource';
import { parsePaginationParams, calculateSkip, buildPaginatedResponse } from '../utils/pagination';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role?: string };
}

export const getResources = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, grade, type, subject, tag, sort = 'newest' } = req.query;

    const filter: any = { isPublished: true };

    if (grade) filter.gradeLevel = grade;
    if (type) filter.type = type;
    if (subject) filter.subject = subject;
    if (tag) filter.tags = tag;

    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
    const skip = calculateSkip(pageNum, limitNum);

    // Sorting
    const sortField: any = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { views: -1 },
      views: { views: -1 },
    };

    const sortOption = sortField[sort as string] || sortField.newest;

    const total = await ResourceModel.countDocuments(filter);
    const resources = await ResourceModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('author', 'name email avatar');

    res.json({
      success: true,
      message: 'Resources retrieved',
      data: buildPaginatedResponse(resources, pageNum, limitNum, total),
    });
  } catch (err) {
    next(err);
  }
};

export const getResourceById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const resource = await ResourceModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name email avatar');

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.json({
      success: true,
      message: 'Resource retrieved',
      data: resource,
    });
  } catch (err) {
    next(err);
  }
};

export const createResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const resource = await ResourceModel.create({
      ...req.body,
      author: req.user.id,
    });

    const populated = await resource.populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

export const updateResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const resource = await ResourceModel.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check authorization
    if (resource.author.toString() !== req.user?.id && req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this resource',
      });
    }

    const updated = await ResourceModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('author', 'name email avatar');

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteResource = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const resource = await ResourceModel.findById(id);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check authorization
    if (resource.author.toString() !== req.user?.id && req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this resource',
      });
    }

    await ResourceModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const searchResources = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { query, page = 1, limit = 10, grade, type, subject, tag } = req.query;

    const filter: any = { isPublished: true };

    if (grade) filter.gradeLevel = grade;
    if (type) filter.type = type;
    if (subject) filter.subject = subject;
    if (tag) filter.tags = tag;

    if (query) {
      filter.$text = { $search: String(query) };
    }

    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
    const skip = calculateSkip(pageNum, limitNum);

    const total = await ResourceModel.countDocuments(filter);
    const resources = await ResourceModel.find(filter)
      .skip(skip)
      .limit(limitNum)
      .populate('author', 'name email avatar');

    res.json({
      success: true,
      message: 'Search results retrieved',
      data: buildPaginatedResponse(resources, pageNum, limitNum, total),
    });
  } catch (err) {
    next(err);
  }
};