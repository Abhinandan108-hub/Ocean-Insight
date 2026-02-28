import { Router } from 'express';
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  addResourceToCollection,
  removeResourceFromCollection,
  shareCollection,
  getPublicCollection,
} from '../controllers/collectionController';
import authMiddleware from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validation';
import {
  createCollectionSchema,
  updateCollectionSchema,
  addResourceToCollectionSchema,
  removeResourceFromCollectionSchema,
} from '../validations/collectionValidation';

const router = Router();

// Public routes
router.get('/public/:token', getPublicCollection);

// Protected routes
router.get('/', authMiddleware, getCollections);
router.get('/:id', authMiddleware, getCollectionById);
router.post('/', authMiddleware, validateRequest(createCollectionSchema), createCollection);
router.put('/:id', authMiddleware, validateRequest(updateCollectionSchema), updateCollection);
router.delete('/:id', authMiddleware, deleteCollection);
router.post('/:id/add', authMiddleware, validateRequest(addResourceToCollectionSchema), addResourceToCollection);
router.post('/:id/remove', authMiddleware, validateRequest(removeResourceFromCollectionSchema), removeResourceFromCollection);
router.post('/:id/share', authMiddleware, shareCollection);

export default router;