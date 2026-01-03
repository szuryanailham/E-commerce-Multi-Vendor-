export * from './error-middleware.js';
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    detail?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = detail;
    Error.captureStackTrace(this);
  }
}

// not found error
export class NotFoundError extends AppError {
  constructor(message = 'Resources not found') {
    super(message, 404);
  }
}

// validatrion Error (user for JOI/zod/eact-hook-form validation error )
export class ValidationError extends AppError {
  constructor(message = 'Invalid request data', details?: any) {
    super(message, 400, true, details);
  }
}

// Authentication error
export class AuthError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// Forbidden Error (for Insufficient Permissions)
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden access') {
    super(message, 403);
  }
}

// Database Error (for MongoBD/postgree SQL)
export class DatabaseError extends AppError {
  constructor(message = 'Database error', details?: any) {
    super(message, 500, true, details);
  }
}

// Rate Limit Error (if user exceeds API limits)
export class RateLimitError extends AppError {
  constructor(message = 'Too many request, please try again letteer') {
    super(message, 429);
  }
}
