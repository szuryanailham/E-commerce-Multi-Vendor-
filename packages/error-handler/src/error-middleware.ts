import { Request, Response, NextFunction } from 'express';
import { AppError } from './index.js';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    console.error(
      `[${req.method}] ${req.url} - ${err.message}`,
      err.details ?? '',
    );

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details ?? null,
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    success: false,
    message: 'Something went wrong, please try again!',
  });
};
