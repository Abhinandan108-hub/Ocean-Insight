import { Request, Response, NextFunction } from 'express';
import EventModel from '../models/event';
import { parsePaginationParams, calculateSkip, buildPaginatedResponse } from '../utils/pagination';

interface AuthRequest extends Request {
  user?: { id: string; email: string; role?: string };
}

export const getEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, location, sort = 'newest' } = req.query;

    const filter: any = {};
    if (location) filter.location = location;

    const { page: pageNum, limit: limitNum } = parsePaginationParams(page, limit);
    const skip = calculateSkip(pageNum, limitNum);

    const sortField: any = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      upcoming: { startDate: 1 },
    };

    const sortOption = sortField[sort as string] || sortField.newest;

    const total = await EventModel.countDocuments(filter);
    const events = await EventModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email avatar')
      .populate('registeredUsers', 'name email');

    res.json({
      success: true,
      message: 'Events retrieved',
      data: buildPaginatedResponse(events, pageNum, limitNum, total),
    });
  } catch (err) {
    next(err);
  }
};

export const getEventById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id)
      .populate('createdBy', 'name email avatar')
      .populate('registeredUsers', 'name email avatar');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      message: 'Event retrieved',
      data: event,
    });
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const event = await EventModel.create({
      ...req.body,
      createdBy: req.user.id,
    });

    const populated = await event.populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.createdBy.toString() !== req.user?.id && req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this event',
      });
    }

    const updated = await EventModel.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate('createdBy', 'name email avatar')
      .populate('registeredUsers', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const event = await EventModel.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.createdBy.toString() !== req.user?.id && req.user?.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this event',
      });
    }

    await EventModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const registerForEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { id } = req.params;
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.registeredUsers.includes(req.user.id as any)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event',
      });
    }

    if (event.maxParticipants && event.registeredUsers.length >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    event.registeredUsers.push(req.user.id as any);
    await event.save();

    res.json({
      success: true,
      message: 'Registered for event successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const unregisterFromEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const { id } = req.params;
    const event = await EventModel.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.registeredUsers = event.registeredUsers.filter(
      (userId) => userId.toString() !== req.user?.id
    );
    await event.save();

    res.json({
      success: true,
      message: 'Unregistered from event successfully',
    });
  } catch (err) {
    next(err);
  }
};