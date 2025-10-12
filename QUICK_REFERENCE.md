# ⚡ Quick Reference Card

## ✅ Foundation Status

**COMPLETE** - Maximum enforcement active

---

## 📦 Centralized Systems

```typescript
import { logger } from '@app/logger';              // Logging
import { db } from '@app/database';                // Database
import { validate, common } from '@app/validation'; // Validation
import { ValidationError } from '@app/errors';     // Errors
import { env, PAGINATION } from '@app/config';     // Config
import { UserId, Validated } from '@app/types';    // Types
```

---

## 🚫 Banned (AI Cannot Do)

```typescript
❌ console.log()                    → Use @app/logger
❌ new PrismaClient()               → Use @app/database
❌ import winston                   → Use @app/logger
❌ import axios                     → Use tRPC
❌ any type                         → Use proper types
❌ data: unknown in DB              → Use Validated<T>
❌ id: string                       → Use UserId
❌ Create package.json in packages/ → ONE at root only
```

---

## ✅ Required Patterns

```typescript
// Logging
import { logger } from '@app/logger';
logger.info('message', { data });

// Database
import { db } from '@app/database';
const result = await db.user.findMany();

// Validation
import { validate } from '@app/validation';
const validated = validate(schema, data);

// Errors
import { NotFoundError } from '@app/errors';
throw new NotFoundError('User', id);

// Types
import { UserId, Validated } from '@app/types';
function getUser(id: UserId): Promise<User>
```

---

## 🛡️ Enforcement Layers

```
0. No package.json in packages/    (validator)
1. File markers required           (validator)
2. No duplicates                   (validator)
3. Package lockdown                (validator)
4. Directory structure             (validator)
5. Import validation               (validator)
6. Biome check                     (linting)
7. TypeScript compilation          (types)
8. Tests must pass                 (quality)
```

**All run on:** `git commit`

---

## 🔧 Commands

```bash
pnpm install          # Install
pnpm run prepare      # Setup hooks
pnpm dev              # Develop
pnpm validate         # Check all
pnpm typecheck        # Type check
pnpm lint             # Lint
pnpm test             # Test
pnpm db:migrate       # DB migration
```

---

## 📁 Structure

```
/workspace/
  package.json                    ← ONE ONLY
  tsconfig.base.json              ← Strict + blocked paths
  biome.json                      ← Lint + format
  
  packages/                       ← NO package.json here!
    types/src/                    ← Branded types
    logger/src/                   ← Centralized logging
    database/src/                 ← Single Prisma
    errors/src/                   ← Error classes
    validation/src/               ← Zod schemas
    config/src/                   ← Env + constants
    
  tools/
    validators/                   ← 6 validators
    
  .husky/
    pre-commit                    ← Runs all checks
```

---

## 💡 Key Principles

1. **ONE** package.json (no others)
2. **Centralized** systems (logger, db, validation)
3. **Branded** types (can't mix primitives)
4. **Validated** data (phantom types)
5. **Blocked** imports (wrong paths don't exist)
6. **Enforced** structure (8 validators)

---

## 🎯 Success Metrics

- ✅ TypeScript compiles = Code is type-safe
- ✅ Pre-commit passes = Code follows rules
- ✅ No escape hatches = AI cannot bypass
- ✅ Documentation complete = Self-explanatory

---

## 🚀 Next Phase (When Ready)

**Phase 3:** Auth, Redux, tRPC, Generators, UI

**For now:** Foundation is LOCKED DOWN. 

Review → Test → Confirm → Continue! 🎉
