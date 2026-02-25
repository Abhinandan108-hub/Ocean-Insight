import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getOverview, postChat, getMapData } from '../controllers/dashboardController';

const router = Router();

// protected overview
router.get('/', authMiddleware, getOverview);

// chat endpoint
router.post('/chat', authMiddleware, postChat);

// optional map data
router.get('/map', authMiddleware, getMapData);

export default router;
