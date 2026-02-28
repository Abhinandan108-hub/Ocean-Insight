import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// Import routes
import authRoutes from './routes/auth';
import resourceRoutes from './routes/resource';
import collectionRoutes from './routes/collection';
import eventRoutes from './routes/event';
import adminRoutes from './routes/admin';
import healthRoutes from './routes/health';
import dashboardRoutes from './routes/dashboard';
import userRoutes from './routes/user';
import testRoutes from './routes/test';

// Import middleware
import { requestLoggerMiddleware } from './middleware/logger';
import { generalLimiter } from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import { successResponse } from './utils/responseFormatter';

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// Configure CORS to allow frontend origins (support multiple dev ports)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8081',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan('dev'));
app.use(requestLoggerMiddleware);

// Rate limiting
app.use(generalLimiter);

// Health check endpoint (no /api/v1 prefix)
app.use('/health', healthRoutes);

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/collections', collectionRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/admin', adminRoutes);

// Legacy API routes (kept for backward compatibility)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/test', testRoutes);
app.use('/test', testRoutes);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json(
    successResponse('Welcome to Ocean Insight API', {
      version: 'v1',
      endpoints: {
        auth: '/api/v1/auth',
        resources: '/api/v1/resources',
        collections: '/api/v1/collections',
        events: '/api/v1/events',
        admin: '/api/v1/admin',
        health: '/health',
      },
    })
  );
});

// Catch-all: ensure any URL and method return a safe JSON response
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
