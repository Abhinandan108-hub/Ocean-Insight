import winston from 'winston';
import LogModel from '../models/log';

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ocean-insight-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Request logging middleware
export const requestLoggerMiddleware = (req: any, res: any, next: any) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    };

    const level = res.statusCode >= 400 ? 'warn' : 'info';
    logger.log(level, `${req.method} ${req.path}`, logData);

    // Save to MongoDB
    if (process.env.MONGO_URI) {
      LogModel.create({
        level: level as any,
        message: `${req.method} ${req.path}`,
        timestamp: new Date(),
        userId: req.user?.id,
        endpoint: req.path,
        statusCode: res.statusCode,
        metadata: logData,
      }).catch((err) => console.error('Failed to save log:', err));
    }
  });

  next();
};

export default logger;