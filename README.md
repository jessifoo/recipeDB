# AI-Proof TypeScript Template

**Reusable foundation for any project - Maximum enforcement built-in.**

> 🎯 This is a **TEMPLATE** - Clone it for every new project you start!

## 🚀 Using This Template

### For a New Project:
```bash
# Quick way:
./create-project.sh my-new-project

# Or use as GitHub template:
# Click "Use this template" on GitHub
```

### For Template Development:
```bash
pnpm install
pnpm run prepare
pnpm run validate
```

See `TEMPLATE_USAGE.md` for detailed instructions.

## 🔒 What's Enforced

**ONE package.json rule:**
- ✅ `/workspace/package.json` - All dependencies here
- ❌ `packages/*/package.json` - Blocked by validator

**Blocked imports:**
```typescript
import { PrismaClient } from '@prisma/client';  // ❌ Path doesn't exist
import winston from 'winston';                   // ❌ Path doesn't exist

import { db } from '@app/database';              // ✅ Only way
import { logger } from '@app/logger';            // ✅ Only way
```

**12 Pre-commit validators:**
1. No package.json in packages/ (CRITICAL)
2. Code quality (no TODOs, .only, empty catch)
3. Type coverage (no explicit 'any')
4. File markers required
5. No duplicates
6. Package validation
7. Directory structure
8. Import validation
9. Function complexity (warning)
10. Test coverage (warning)
11. Biome check
12. TypeScript + tests

## 📦 Core Packages

```typescript
import { logger } from '@app/logger';              // Logging
import { db } from '@app/database';                // Database
import { validate, common } from '@app/validation'; // Validation
import { ValidationError } from '@app/errors';     // Errors
import { env, PAGINATION } from '@app/config';     // Config
import { UserId, Validated } from '@app/types';    // Types
```

All packages = **folders only** (no package.json!)

## 🛠️ Commands

```bash
pnpm dev              # Start dev
pnpm build            # Build
pnpm typecheck        # Type check
pnpm lint             # Lint
pnpm test             # Test
pnpm validate         # All checks
pnpm db:migrate       # DB migration
```

## 📚 Docs

**For Template Users:**
- `TEMPLATE_USAGE.md` - How to create projects ← **START HERE**
- `PROJECTS.md` - Example project ideas
- `GENERATORS.md` - How to generate features ← **POWERFUL**
- `.github/TEMPLATE_CHECKLIST.md` - Setup checklist

**For Development:**
- `COMPLETE_SOLUTION.md` - Full system overview
- `AI_CODING_RULES.md` - Rules for AI
- `QUICK_REFERENCE.md` - Quick lookup
- `QUALITY_ENFORCEMENT.md` - Quality rules

## 🎯 State Management Strategy

```typescript
// Server state (DB, API) → tRPC + TanStack Query
// URL state (filters, pagination) → nuqs (type-safe searchParams)
// Form state (validation) → React Hook Form + Zod
// Client state (UI, modals) → Zustand
```

## 🎯 Generator System

**Generate complete features with one command:**
```bash
pnpm generate:feature recipe \
  --fields "title:string,ingredients:string" \
  --ops create,get,list,update,delete
```

**Creates:**
- Service + Repository (with error handling)
- tRPC Router (with validation)
- Validation schemas
- Unit tests (mocked)
- Integration tests (real DB)

See `GENERATORS.md` for details.

## 🎯 Next: Phase 3

- [x] Generators (DONE!)
- [x] Error handling (DONE!)
- [ ] Auth (NextAuth)
- [ ] Zustand store setup
- [ ] tRPC boilerplate
- [ ] React Hook Form patterns
- [ ] UI components

## License

MIT - Jessica Johnson
