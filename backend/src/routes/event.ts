import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} from '../controllers/eventController';
import authMiddleware from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validation';
import {
  createEventSchema,
  updateEventSchema,
} from '../validations/eventValidation';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', authMiddleware, validateRequest(createEventSchema), createEvent);
router.put('/:id', authMiddleware, validateRequest(updateEventSchema), updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.post('/:id/register', authMiddleware, registerForEvent);
router.post('/:id/unregister', authMiddleware, unregisterFromEvent);

export default router;