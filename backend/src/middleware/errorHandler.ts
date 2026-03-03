/**
 * Global Error Handler Middleware
 * Centralized error handling for the Express application
 */

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  // Log error for debugging
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle different error types
  if (error instanceof AppError) {
    // Custom application errors
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma database errors
    statusCode = 400;
    
    switch (error.code) {
      case 'P2002':
        message = 'A record with this information already exists';
        details = { field: error.meta?.target };
        break;
      case 'P2025':
        message = 'Record not found';
        break;
      case 'P2003':
        message = 'Foreign key constraint failed';
        break;
      default:
        message = 'Database operation failed';
        details = { code: error.code };
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // Prisma validation errors
    statusCode = 400;
    message = 'Invalid data provided';
  } else if (error.name === 'ValidationError') {
    // Express validator errors
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'JsonWebTokenError') {
    // JWT errors
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (error.name === 'TokenExpiredError') {
    // JWT expiration errors
    statusCode = 401;
    message = 'Authentication token expired';
  } else if (error.name === 'MulterError') {
    // File upload errors
    statusCode = 400;
    message = 'File upload error';
    details = { type: error.message };
  }

  // Prepare error response
  const errorResponse: any = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method,
  };

  // Add details in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
    if (details) {
      errorResponse.details = details;
    }
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};