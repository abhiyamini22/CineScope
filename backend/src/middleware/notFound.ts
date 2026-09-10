import type { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Route not found: ${req.originalUrl}`) as Error & { statusCode: number };
  error.statusCode = 404;
  next(error);
};
