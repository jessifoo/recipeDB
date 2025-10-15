# ✅ SIMPLE Template - What You Have

## 🎯 This Solves Your Problem

**Before:** AI creates random files, duplicate implementations, scattered code
**After:** ONE pattern. Everything enforced. AI must follow it.

---

## 📦 What's Built

### 1. Working Example Route (`src/server/api/routers/example.ts`)
**Full CRUD with everything connected:**
- Database (Prisma)
- Logging (logger.info, logger.error)
- Error handling (TRPCError)
- Validation (Zod)
- Tests (end-to-end)

**This is your template.** Copy it for every new route.

### 2. Simple lib/ Folder
```
src/lib/
  db.ts       ← ONE Prisma client (import { db } from '@/lib/db')
  logger.ts   ← Simple logger (import { logger } from '@/lib/logger')
  env.ts      ← Type-safe env vars (import { env } from '@/lib/env')
```

### 3. Validators (Force AI to Follow Patterns)
```
✅ Must use @/lib/db (not new PrismaClient())
✅ Must use @/lib/logger (not console.log)
✅ Must use TRPCError (not custom error classes)
✅ Code quality checks
✅ TypeScript strict
```

---

## 🚀 Using This Template

### For Your Recipe Database

1. **Copy the example pattern:**
```typescript
// src/server/api/routers/recipe.ts
import { z } from 'zod';
import { router, publicProcedure, TRPCError } from '../trpc';

export const recipeRouter = router({
  create: publicProcedure
    .input(z.object({
      title: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      ctx.logger.info('Creating recipe', { title: input.title });
      
      try {
        return await ctx.db.recipe.create({ data: input });
      } catch (error) {
        ctx.logger.error('Failed to create recipe', { error });
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
  
  // Copy getById, list, update, delete from example.ts
});
```

2. **Update Prisma schema:**
```prisma
model Recipe {
  id           String   @id @default(cuid())
  title        String
  ingredients  String[] // Or JSON
  instructions String
  createdAt    DateTime @default(now())
}
```

3. **Push schema:**
```bash
pnpm db:push
```

**Done!** Same pattern. AI can't deviate.

### For ANY Future Project

1. Clone this template
2. Update `prisma/schema.prisma` with your models
3. Copy `example.ts` for each model
4. `pnpm db:push`

**Everything already works.** Just add your models.

---

## 🛡️ How It Prevents AI Mess

### Problem: AI creates new error implementations
**Solution:** Validator blocks custom error classes → Must use `TRPCError`

### Problem: AI creates new logging files
**Solution:** Validator blocks `console.log` → Must use `logger`

### Problem: AI creates multiple Prisma clients
**Solution:** Validator blocks `new PrismaClient()` → Must use `db`

### Problem: AI creates inconsistent routes
**Solution:** Validator + example pattern → Copy `example.ts`

---

## 📊 File Count

**Before (complex):** 50+ files (packages/, validators/, etc.)
**After (simple):** ~10 core files

```
src/lib/          3 files (db, logger, env)
src/server/api/   4 files (trpc, root, example router, test)
tools/validators/ 2 files (enforce centralized, code quality)
configs/          3 files (tsconfig, biome, husky)
```

**Total: 12 files**

Everything else is YOUR code.

---

## ✅ Next Steps

1. **Test it works:**
   ```bash
   pnpm test
   ```

2. **Try the ping endpoint:**
   ```bash
   curl http://localhost:3000/api/trpc/example.ping
   ```

3. **Copy the pattern for your first real route**

4. **Build your app!**

---

## 💡 Key Insight

**You don't need complex architecture.**
**You need ONE working pattern + enforcement.**

This template gives you both.

Simple. Working. Enforced. 🎯
