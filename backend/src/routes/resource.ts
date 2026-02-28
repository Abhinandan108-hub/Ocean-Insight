import { Router } from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  searchResources,
} from '../controllers/resourceController';
import authMiddleware from '../middleware/authMiddleware';
import { requireRole } from '../middleware/authorization';
import { validateRequest } from '../middleware/validation';
import {
  createResourceSchema,
  updateResourceSchema,
  searchResourceSchema,
} from '../validations/resourceValidation';

const router = Router();

// Public routes
router.get('/', getResources);
router.get('/search', validateRequest(searchResourceSchema), searchResources);
router.get('/:id', getResourceById);

// Protected routes
router.post('/', authMiddleware, validateRequest(createResourceSchema), createResource);
router.put('/:id', authMiddleware, validateRequest(updateResourceSchema), updateResource);
router.delete('/:id', authMiddleware, deleteResource);

export default router;