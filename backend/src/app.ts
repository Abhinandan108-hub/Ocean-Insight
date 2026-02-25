import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import testRoutes from './routes/test';
import userRoutes from './routes/user';
import errorHandler from './middleware/errorHandler';

const app = express();

// global middleware
app.use(helmet());

// configure CORS to allow frontend origin
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);
app.use('/api/test', testRoutes);

// direct test route for convenience (GET http://localhost:4000/test)
app.use('/test', testRoutes);

// root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Ocean Insight API',
  });
});

// catch-all: ensure any URL and method return a safe JSON response
app.all('*', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Ocean Insight API is running',
    path: req.originalUrl,
    method: req.method,
  });
});

// error handler (must be last)
app.use(errorHandler);

export default app;
