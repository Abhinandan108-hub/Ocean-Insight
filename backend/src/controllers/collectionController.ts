import { Request, Response, NextFunction } from 'express';
import CollectionModel from '../models/collection';
import { parsePaginationParams, calculateSkip, buildPaginatedResponse } from '../utils/pagination';
import { generateRandomToken } from '../utils/responseFormatter';
import emailService from '../services/emailService';
import UserModel from '../models/user';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role?: string };
}

export const getCollections = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
    const skip = calculateSkip(pageNum, limitNum);

    const filter = { userId: req.user.id };
    const total = await CollectionModel.countDocuments(filter);
    const collections = await CollectionModel.find(filter)
      .skip(skip)
      .limit(limitNum)
      .populate('resourceIds');

    res.json({
      success: true,
      message: 'Collections retrieved',
      data: buildPaginatedResponse(collections, pageNum, limitNum, total),
    });
  } catch (err) {
    next(err);
  }
};

export const getCollectionById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const collection = await CollectionModel.findById(id).populate('resourceIds');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found',
      });
    }

    // Check authorization for private collections
    if (!collection.isPublic && collection.userId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.json({
      success: true,
      message: 'Collection retrieved',
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};

export const createCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const collection = await CollectionModel.create({
      ...req.body,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const collection = await CollectionModel.findById(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found',
      });
    }

    if (collection.userId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const updated = await CollectionModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('resourceIds');

    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const collection = await CollectionModel.findById(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found',
      });
    }

    if (collection.userId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await CollectionModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const addResourceToCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { resourceId } = req.body;

    const collection = await CollectionModel.findById(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found',
      });
    }

    if (collection.userId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (collection.resourceIds.includes(resourceId)) {
      return res.status(400).json({
        success: false,
        message: 'Resource already in collection',
      });
    }

    collection.resourceIds.push(resourceId);
    await collection.save();

    res.json({
      success: true,
      message: 'Resource added to collection',
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};

export const removeResourceFromCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { resourceId } = req.body;

    const collection = await CollectionModel.findById(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found',
      });
    }

    if (collection.userId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    collection.resourceIds = collection.resourceIds.filter(
      (id) => id.toString() !== resourceId
    );
    await collection.save();

    res.json({
      success: true,
      message: 'Resource removed from collection',
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};

export const shareCollection = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const collection = await CollectionModel.findById(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found',
      });
    }

    if (collection.userId.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Generate share token if not already present
    if (!collection.shareToken) {
      collection.shareToken = generateRandomToken(32);
      await collection.save();
    }

    const shareLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/collections/${collection.shareToken}`;
    const user = await UserModel.findById(req.user.id);

    // Send email
    await emailService.sendCollectionSharedEmail(
      email,
      user?.name || 'A user',
      collection.title,
      shareLink
    );

    res.json({
      success: true,
      message: 'Collection shared successfully',
      data: {
        shareLink,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getPublicCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    const collection = await CollectionModel.findOne({
      shareToken: token,
    }).populate('resourceIds');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found',
      });
    }

    res.json({
      success: true,
      message: 'Collection retrieved',
      data: collection,
    });
  } catch (err) {
    next(err);
  }
};