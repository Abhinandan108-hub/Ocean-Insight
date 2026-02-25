import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  success: boolean;
  error: string;
  data?: any;
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

export default errorHandler;
