import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SENTRIX Server Error]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal SENTRIX Core Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};
