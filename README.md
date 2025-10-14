# Simple Full-Stack Template

**Working end-to-end. Ready to use. Easy to maintain.**

## 🚀 Quick Start

```bash
# 1. Install
pnpm install

# 2. Setup env
cp .env.example .env
# Edit .env with your database

# 3. Setup database
pnpm db:push

# 4. Test it works
pnpm test

# 5. Start dev
pnpm dev
```

## 📁 Structure (SIMPLE)

```
src/
  lib/
    db.ts           ← Database (ONE Prisma client)
    logger.ts       ← Logger (simple wrapper)
    env.ts          ← Environment vars (type-safe)
    
  server/api/
    trpc.ts         ← tRPC setup
    root.ts         ← Router registry
    routers/
      example.ts    ← WORKING example (copy this!)
      
  app/              ← Next.js App Router
```

## ✅ What's Working

**Full CRUD example in `src/server/api/routers/example.ts`:**
- ✅ Create, Read, Update, Delete
- ✅ Error handling (tRPC errors)
- ✅ Logging (logger.info, logger.error)
- ✅ Database (Prisma)
- ✅ Validation (Zod)
- ✅ Tests (working end-to-end)

**Test it:**
```bash
# Ping test (tests DB, logger, everything)
curl http://localhost:3000/api/trpc/example.ping

# Or run tests
pnpm test
```

## 🎯 How to Add New Routes

**Copy the pattern in `example.ts`:**

1. Create router file:
```typescript
// src/server/api/routers/user.ts
import { z } from 'zod';
import { router, publicProcedure, TRPCError } from '../trpc';

export const userRouter = router({
  create: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      ctx.logger.info('Creating user', { email: input.email });
      
      try {
        return await ctx.db.user.create({ data: input });
      } catch (error) {
        ctx.logger.error('Failed to create user', { error });
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  // ... getById, list, update, delete (copy from example.ts)
});
```

2. Add to root router:
```typescript
// src/server/api/root.ts
import { userRouter } from './routers/user';

export const appRouter = router({
  example: exampleRouter,
  user: userRouter, // ← Add here
});
```

3. Update Prisma schema:
```prisma
// prisma/schema.prisma
model User {
  id    String @id @default(cuid())
  name  String
  email String @unique
}
```

4. Push schema:
```bash
pnpm db:push
```

**Done!** Your route follows the EXACT same pattern.

## 🛡️ What's Enforced

Validators prevent AI from creating mess:

❌ Can't create new `PrismaClient()` → Must use `@/lib/db`
❌ Can't import winston/pino → Must use `@/lib/logger`
❌ Can't use `console.log` → Must use `logger.*`
❌ Can't create custom error classes → Must use `TRPCError`

**Result:** Consistent code. Always.

## 📝 Adding Features

### New Error Type
Just use tRPC error codes:
```typescript
throw new TRPCError({ 
  code: 'BAD_REQUEST', 
  message: 'Your custom message' 
});
```

### New Log Location
Just use the logger:
```typescript
import { logger } from '@/lib/logger';

logger.info('Something happened', { data });
logger.error('Something failed', { error });
```

### New Env Var
Add to `src/lib/env.ts`:
```typescript
const envSchema = z.object({
  // ... existing
  MY_NEW_VAR: z.string(),
});
```

Then use: `env.MY_NEW_VAR`

## 🧪 Tests

Every route has tests. Copy the pattern:

```typescript
// src/server/api/routers/user.test.ts
import { describe, it, expect } from 'vitest';
import { appRouter } from '../root';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

const caller = appRouter.createCaller({ db, logger, headers: new Headers() });

describe('User Router', () => {
  it('should create user', async () => {
    const user = await caller.user.create({
      name: 'Test',
      email: 'test@example.com',
    });
    
    expect(user.id).toBeDefined();
  });
});
```

## 🎯 Philosophy

**SIMPLE:**
- Use framework features (tRPC errors, Zod validation)
- Don't reinvent the wheel
- ONE lib/ folder with basics
- Copy `example.ts` for new routes

**ENFORCED:**
- Validators prevent deviating
- AI must follow patterns
- Consistent codebase

**WORKING:**
- Full end-to-end example
- Tests included
- Ready to extend

## 🔧 Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm test             # Run tests
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Prisma Studio
pnpm lint             # Lint code
pnpm typecheck        # Type check
```

**That's it. Simple. Working. Ready to use.** ✅
