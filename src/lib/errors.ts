/**
 * Domain Error Handling
 * Maps business errors to tRPC error codes
 */

import { TRPCError } from '@trpc/server';

/**
 * Base domain error - Extend for specific error types
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
  
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert to tRPC error for transport layer
   */
  abstract toTRPCError(): TRPCError;
}

/**
 * Not Found Error - Entity doesn't exist
 */
export class NotFoundError extends DomainError {
  readonly code = 'NOT_FOUND';

  toTRPCError(): TRPCError {
    return new TRPCError({
      code: 'NOT_FOUND',
      message: this.message,
      cause: this,
    });
  }
}

/**
 * Validation Error - Invalid input/business rules
 */
export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';

  toTRPCError(): TRPCError {
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: this.message,
      cause: this,
    });
  }
}

/**
 * Authorization Error - User lacks permission
 */
export class UnauthorizedError extends DomainError {
  readonly code = 'UNAUTHORIZED';

  toTRPCError(): TRPCError {
    return new TRPCError({
      code: 'UNAUTHORIZED',
      message: this.message,
      cause: this,
    });
  }
}

/**
 * Conflict Error - Resource already exists
 */
export class ConflictError extends DomainError {
  readonly code = 'CONFLICT';

  toTRPCError(): TRPCError {
    return new TRPCError({
      code: 'CONFLICT',
      message: this.message,
      cause: this,
    });
  }
}

/**
 * Internal Error - Unexpected system error
 */
export class InternalError extends DomainError {
  readonly code = 'INTERNAL_ERROR';

  toTRPCError(): TRPCError {
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: this.message,
      cause: this,
    });
  }
}

/**
 * Error handler utility - Convert any error to TRPCError
 */
export function handleError(error: unknown): TRPCError {
  if (error instanceof DomainError) {
    return error.toTRPCError();
  }

  if (error instanceof TRPCError) {
    return error;
  }

  // Unknown error - log and return generic error
  console.error('Unexpected error:', error);
  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
}
