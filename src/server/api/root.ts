/**
 * Root router - Add all routers here
 */

import { router } from './trpc';
import { exampleRouter } from './routers/example';

export const appRouter = router({
  example: exampleRouter,
  // Add more routers here
});

export type AppRouter = typeof appRouter;
