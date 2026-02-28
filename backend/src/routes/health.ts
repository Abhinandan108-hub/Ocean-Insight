import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/responseFormatter';

const router = Router();

// Health check endpoint
router.get('/', (req: Request, res: Response) => {
  res.json(
    successResponse('API is healthy', {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  );
});

export default router;