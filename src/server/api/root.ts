/**
 * Root tRPC router - Aggregate all feature routers
 */

import { router } from './trpc';
import { exampleRouter } from '@/infrastructure/api/trpc.adapter';

export const appRouter = router({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
