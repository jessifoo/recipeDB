/**
 * Example router - WORKING end-to-end template
 * Copy this pattern for all future routes
 */

import { z } from 'zod';
import { router, publicProcedure, TRPCError } from '../trpc';

export const exampleRouter = router({
  // CREATE
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      ctx.logger.info('Creating example', { name: input.name });

      try {
        const example = await ctx.db.example.create({
          data: input,
        });

        ctx.logger.info('Example created', { id: example.id });
        return example;
      } catch (error) {
        ctx.logger.error('Failed to create example', { error });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create example',
        });
      }
    }),

  // GET by ID
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const example = await ctx.db.example.findUnique({
        where: { id: input },
      });

      if (!example) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Example not found',
        });
      }

      return example;
    }),

  // LIST all
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.example.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }),

  // UPDATE
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;

      // Check exists
      const existing = await ctx.db.example.findUnique({ where: { id } });
      if (!existing) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Example not found' });
      }

      try {
        return await ctx.db.example.update({
          where: { id },
          data,
        });
      } catch (error) {
        ctx.logger.error('Failed to update example', { error });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update example',
        });
      }
    }),

  // DELETE
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.example.delete({
          where: { id: input },
        });
        return { success: true };
      } catch (error) {
        ctx.logger.error('Failed to delete example', { error });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete example',
        });
      }
    }),

  // HEALTH CHECK - Test everything works
  ping: publicProcedure.query(async ({ ctx }) => {
    // Test DB
    await ctx.db.$queryRaw`SELECT 1`;
    
    // Test logger
    ctx.logger.info('Ping successful');
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    };
  }),
});
