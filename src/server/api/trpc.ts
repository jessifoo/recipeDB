/**
 * tRPC setup - Use TRPCError for all errors
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

// Context for all procedures
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    logger,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Export TRPCError for use in routers
export { TRPCError };
