# AI-Proof TypeScript Template

**Maximum enforcement foundation - Makes bad code impossible.**

## 🚀 Quick Start

```bash
pnpm install
pnpm run prepare
pnpm run validate
```

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

- `AI_CODING_RULES.md` - Rules for AI
- `QUICK_REFERENCE.md` - Quick lookup
- Each package has its own README

## 🎯 State Management Strategy

```typescript
// Server state (DB, API) → tRPC + TanStack Query
// URL state (filters, pagination) → nuqs (type-safe searchParams)
// Form state (validation) → React Hook Form + Zod
// Client state (UI, modals) → Zustand
```

## 🎯 Next: Phase 3

- [ ] Auth (NextAuth)
- [ ] Zustand store setup
- [ ] tRPC
- [ ] React Hook Form patterns
- [ ] Generators
- [ ] UI components

## License

MIT - Jessica Johnson
