/**
 * tRPC Middleware - All cross-cutting concerns in ONE file
 * - Request correlation
 * - Logging
 * - Error handling
 * - Auth (future)
 * - Rate limiting (future)
 */

import { TRPCError } from '@trpc/server';
import { createLogger } from '@/lib/logger';
import { publicProcedure } from '../api/trpc';
import { handleError } from '@/lib/errors';

/**
 * Generate correlation ID for request tracking
 */
function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Correlation middleware - Add correlation ID to context
 */
export const correlationMiddleware = publicProcedure.use(async ({ ctx, next }) => {
  const correlationId = generateCorrelationId();
  const logger = createLogger(correlationId);

  return next({
    ctx: {
      ...ctx,
      correlationId,
      logger,
    },
  });
});

/**
 * Logging middleware - Log all requests/responses
 */
export const loggingMiddleware = correlationMiddleware.use(async ({ ctx, path, type, next }) => {
  const start = Date.now();
  ctx.logger.info(`${type} ${path} - START`);

  try {
    const result = await next({ ctx });
    const duration = Date.now() - start;
    ctx.logger.info(`${type} ${path} - SUCCESS`, { duration });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    ctx.logger.error(`${type} ${path} - ERROR`, { duration, error });
    throw error;
  }
});

/**
 * Error handling middleware - Convert domain errors to tRPC errors
 */
export const errorHandlingMiddleware = loggingMiddleware.use(async ({ ctx, next }) => {
  try {
    return await next({ ctx });
  } catch (error) {
    throw handleError(error);
  }
});

/**
 * Protected procedure - Requires authentication
 * TODO: Implement when NextAuth is added
 */
export const protectedProcedure = errorHandlingMiddleware.use(async ({ ctx, next }) => {
  // if (!ctx.session?.user) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED' });
  // }
  return next({ ctx });
});

/**
 * Public procedure with all middleware
 */
export const publicProcedureWithMiddleware = errorHandlingMiddleware;
