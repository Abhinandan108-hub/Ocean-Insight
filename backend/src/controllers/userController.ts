import { Request, Response } from 'express';

export const getProfile = (req: Request, res: Response) => {
  // authMiddleware attaches req.user
  const user = (req as any).user || { id: 'demo', email: 'demo@floatchat.ai' };
  return res.json({ success: true, data: { user } });
};
