/**
 * Example Router - Transport layer (tRPC)
 * Thin layer: validate input → call service → return response
 */

import { z } from 'zod';
import { router } from '@/server/api/trpc';
import { publicProcedureWithMiddleware } from '@/server/core/middleware';
import { ExampleService } from './service';
import { ExampleRepository } from './repository';
import { createExampleSchema, updateExampleSchema, exampleFilterSchema } from './types';

/**
 * Example router - CRUD operations
 */
export const exampleRouter = router({
  /**
   * Get by ID
   */
  getById: publicProcedureWithMiddleware
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const service = new ExampleService({
        repository: new ExampleRepository({ db: ctx.db, logger: ctx.logger }),
        logger: ctx.logger,
      });
      return service.getById(input);
    }),

  /**
   * List with optional filter
   */
  list: publicProcedureWithMiddleware
    .input(exampleFilterSchema)
    .query(async ({ input, ctx }) => {
      const service = new ExampleService({
        repository: new ExampleRepository({ db: ctx.db, logger: ctx.logger }),
        logger: ctx.logger,
      });
      return service.list(input);
    }),

  /**
   * Create new example
   */
  create: publicProcedureWithMiddleware
    .input(createExampleSchema)
    .mutation(async ({ input, ctx }) => {
      const service = new ExampleService({
        repository: new ExampleRepository({ db: ctx.db, logger: ctx.logger }),
        logger: ctx.logger,
      });
      return service.create(input);
    }),

  /**
   * Update existing example
   */
  update: publicProcedureWithMiddleware
    .input(z.object({
      id: z.string(),
      data: updateExampleSchema,
    }))
    .mutation(async ({ input, ctx }) => {
      const service = new ExampleService({
        repository: new ExampleRepository({ db: ctx.db, logger: ctx.logger }),
        logger: ctx.logger,
      });
      return service.update(input.id, input.data);
    }),

  /**
   * Delete example
   */
  delete: publicProcedureWithMiddleware
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const service = new ExampleService({
        repository: new ExampleRepository({ db: ctx.db, logger: ctx.logger }),
        logger: ctx.logger,
      });
      return service.delete(input);
    }),

  /**
   * Health check - Test all layers
   */
  ping: publicProcedureWithMiddleware
    .query(async ({ ctx }) => {
      await ctx.db.$queryRaw`SELECT 1`;
      ctx.logger.info('Ping successful');
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    }),
});
