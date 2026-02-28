import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { requireRole } from '../middleware/authorization';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  getAllResources,
  publishResource,
  unpublishResource,
  getLogs,
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication and Admin role
router.use(authMiddleware);
router.use(requireRole('Admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.put('/users/:userId/deactivate', deactivateUser);

// Resource management
router.get('/resources', getAllResources);
router.put('/resources/:resourceId/publish', publishResource);
router.put('/resources/:resourceId/unpublish', unpublishResource);

// Logs
router.get('/logs', getLogs);

export default router;