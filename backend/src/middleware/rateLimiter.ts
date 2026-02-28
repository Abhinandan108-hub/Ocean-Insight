import rateLimit from 'express-rate-limit';

// General rate limiter - 100 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate limiter - 5 requests per 15 minutes (stricter for login/signup)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later.',
  skip: (req) => req.method !== 'POST',
  standardHeaders: true,
  legacyHeaders: false,
});

// Search rate limiter - 30 requests per minute
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: 'Too many search requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Email rate limiter - 3 requests per hour
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many email requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});