import { Request, Response } from 'express';

export const test = (req: Request, res: Response): Response => {
  return res.json({ message: 'Backend working successfully' });
};
