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

**8 Pre-commit validators:**
1. No package.json in packages/
2. File markers required
3. No duplicates
4. Package validation
5. Directory structure
6. Import validation
7. Biome check
8. TypeScript + tests

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

## 🎯 Next: Phase 3

- [ ] Auth (NextAuth)
- [ ] State management
- [ ] tRPC
- [ ] Generators
- [ ] UI components

## License

MIT - Jessica Johnson
