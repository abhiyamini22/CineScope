import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(message);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? 'Unable to fetch movies at the moment.' : message,
  });
};
