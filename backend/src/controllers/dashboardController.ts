import { Request, Response } from 'express';

// sample metrics data
const metrics = {
  floatsActive: 3241,
  profilesToday: 8432,
  avgDepth: "1,842m",
  dataQuality: "99.1%",
};

export const getOverview = (req: Request, res: Response) => {
  return res.json({ success: true, data: { metrics } });
};

export const postChat = (req: Request, res: Response) => {
  const { question } = req.body;
  const responses = [
    `Analyzing '${question}'... sample response 1`,
    `Sample response 2 for '${question}'`,
    `Here's some dummy data regarding '${question}'`,
  ];
  const answer = responses[Math.floor(Math.random() * responses.length)];
  return res.json({ success: true, data: { answer } });
};

export const getMapData = (req: Request, res: Response) => {
  // return a few random float positions
  const positions = [
    { x: 20, y: 30 },
    { x: 45, y: 55 },
    { x: 68, y: 25 },
    { x: 30, y: 70 },
    { x: 75, y: 45 },
  ];
  return res.json({ success: true, data: { positions } });
};
