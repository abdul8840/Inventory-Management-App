import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiError } from '../utils/apiError';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof ApiError ? error.message : 'Internal server error';

  if (statusCode >= 500) {
    logger.error({ error }, message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    details: error instanceof ApiError ? error.details : undefined,
    stack: env.NODE_ENV === 'development' ? error.stack : undefined
  });
};
