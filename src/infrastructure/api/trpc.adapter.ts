/**
 * tRPC Adapter - Implements API transport layer
 * Can swap to rest.adapter.ts or graphql.adapter.ts
 */

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '@/server/api/trpc';
import { ExampleService } from '@/core/services/example.service';
import { PrismaExampleRepository } from '../db/prisma.adapter';
import { ConsoleLogger } from '../logger/console.adapter';
import { InMemoryCache } from '../cache/in-memory.adapter';
import { InMemoryEventBus } from '../events/in-memory.adapter';
import { db } from '@/lib/db';

/**
 * Validation schemas (tRPC-specific)
 */
const createExampleSchema = z.object({
  name: z.string().min(1).max(100),
  content: z.string().min(1),
});

const updateExampleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
});

const filterSchema = z.object({
  search: z.string().optional(),
}).optional();

/**
 * tRPC Router - Uses core service with injected dependencies
 */
export const exampleRouter = router({
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const service = createExampleService(ctx.correlationId);
      try {
        return await service.getById(input);
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  list: publicProcedure
    .input(filterSchema)
    .query(async ({ input, ctx }) => {
      const service = createExampleService(ctx.correlationId);
      try {
        return await service.list(input);
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  create: publicProcedure
    .input(createExampleSchema)
    .mutation(async ({ input, ctx }) => {
      const service = createExampleService(ctx.correlationId);
      try {
        return await service.create(input);
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: updateExampleSchema }))
    .mutation(async ({ input, ctx }) => {
      const service = createExampleService(ctx.correlationId);
      try {
        return await service.update(input.id, input.data);
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const service = createExampleService(ctx.correlationId);
      try {
        await service.delete(input);
        return { success: true };
      } catch (error) {
        throw toTRPCError(error);
      }
    }),

  ping: publicProcedure.query(async () => {
    await db.$queryRaw`SELECT 1`;
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
});

/**
 * Service factory - Wire dependencies (composition root)
 */
function createExampleService(correlationId?: string): ExampleService {
  const logger = new ConsoleLogger('ExampleService', correlationId);
  const repository = new PrismaExampleRepository(db, logger);
  const cache = new InMemoryCache();
  const eventBus = new InMemoryEventBus();

  return new ExampleService({
    repository,
    logger,
    cache,
    eventBus,
  });
}

/**
 * Error mapper - Convert domain errors to tRPC errors
 */
function toTRPCError(error: unknown): TRPCError {
  if (error instanceof TRPCError) return error;

  if (error instanceof Error) {
    if (error.message.includes('not found')) {
      return new TRPCError({ code: 'NOT_FOUND', message: error.message });
    }
    return new TRPCError({ code: 'BAD_REQUEST', message: error.message });
  }

  return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'An error occurred' });
}
