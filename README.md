# Maximum Enforcement Full-Stack Template

**A production-ready TypeScript monorepo with AI-proof guardrails.**

> Built for developers who are tired of AI creating chaos. Every architectural decision is enforced automatically.

---

## 🎯 Philosophy

**"If TypeScript compiles and pre-commit passes, the code is correct. Period."**

This template makes it **physically impossible** to:
- Add dependencies outside central control
- Import banned packages  
- Use console.log
- Skip validation
- Mix up types
- Create duplicate code
- Put files in wrong places

---

## ✅ What's Built

### Enforcement Stack (Phase 1)
- ✅ TypeScript maximum strictness (all flags)
- ✅ Branded types (IDs, validation state, etc.)
- ✅ Biome (replaces ESLint + Prettier - 10x faster)
- ✅ Locked VS Code config (committed)
- ✅ File marker system (generator enforcement)
- ✅ 8 pre-commit validators
- ✅ Package lockdown (one package.json only)
- ✅ Import path blocking

### Core Packages (Phase 2)
- ✅ `@app/types` - Branded types, pagination
- ✅ `@app/logger` - Centralized logging
- ✅ `@app/database` - Single Prisma instance
- ✅ `@app/errors` - Error hierarchy
- ✅ `@app/validation` - Zod schemas
- ✅ `@app/config` - Type-safe env vars

---

## 🚀 Quick Start

```bash
# Install
pnpm install

# Setup git hooks
pnpm run prepare

# Validate everything
pnpm run validate

# Start coding!
```

---

## 📦 Package Structure

```
/workspace/
  package.json              ← ONE package.json (all deps here)
  
  packages/
    types/                  ← Branded types (NO package.json!)
    logger/                 ← Logging (NO package.json!)
    database/               ← Prisma client (NO package.json!)
    errors/                 ← Error classes (NO package.json!)
    validation/             ← Zod schemas (NO package.json!)
    config/                 ← Env + constants (NO package.json!)
```

**CRITICAL:** Packages are folders with TypeScript files only. No package.json files in packages/!

---

## 🛡️ What AI Cannot Do

| Violation | Blocked By | Result |
|-----------|------------|--------|
| Create package.json in packages/ | Validator #0 | Commit blocked |
| Import @prisma/client | TypeScript paths | Won't compile |
| Import winston/pino | TypeScript paths | Won't compile |
| Use console.log | Biome | Won't save |
| Use `any` type | TypeScript strict | Won't compile |
| Skip validation | Phantom types | Won't compile |
| Mix ID types | Branded types | Won't compile |
| Create file without marker | Validator #1 | Commit blocked |
| Duplicate exports | Validator #2 | Commit blocked |
| Wrong file location | Validator #4 | Commit blocked |

**Every violation is caught automatically. No escape hatches.**

---

## ✅ Usage Examples

### Logging
```typescript
import { logger } from '@app/logger';

logger.info('User logged in', { userId: 123 });
logger.error('Failed to save', error);

// ❌ console.log blocked
```

### Database
```typescript
import { db } from '@app/database';

const users = await db.user.findMany();

// ❌ new PrismaClient() blocked
```

### Validation
```typescript
import { validate, common } from '@app/validation';
import { z } from 'zod';

const schema = z.object({
  email: common.email,
  age: common.positiveInt,
});

const validated = validate(schema, data);
// validated is Validated<T>
```

### Branded Types
```typescript
import { UserId, Validated } from '@app/types';

function getUser(id: UserId) { ... }
function save(data: Validated<UserInput>) { ... }

getUser(UserId('123'));                    // ✅
getUser('123');                            // ❌ Type error
save(validate(schema, data));              // ✅
save(data);                                // ❌ Type error
```

---

## 📋 Pre-Commit Checks

Every commit runs:

```
0/8 No package.json in packages/ ✅
1/8 File markers ✅
2/8 No duplicates ✅
3/8 Package validation ✅
4/8 Directory structure ✅
5/8 Import validation ✅
6/8 Biome check ✅
7/8 TypeScript compilation ✅
8/8 Tests ✅

All checks passed! Commit allowed.
```

If ANY fail, commit is **BLOCKED**.

---

## 🎓 Documentation

- `AI_CODING_RULES.md` - Rules for AI assistants
- `ARCHITECTURE.md` - System design
- `EXAMPLES.md` - Usage examples
- `ENFORCEMENT_SUMMARY.md` - What's enforced
- `PHASE_1_2_COMPLETE.md` - Build summary
- `FOUNDATION_COMPLETE.md` - Technical details

Each package has detailed README with examples.

---

## 🚧 Next Steps (Phase 3)

Not built yet, but foundation is ready for:
- [ ] Auth (NextAuth + routing)
- [ ] Redux store
- [ ] tRPC setup
- [ ] Generators (module, component, etc.)
- [ ] UI components

---

## ✨ The Result

**A foundation where:**
- TypeScript enforces correctness
- Biome enforces style
- Pre-commit enforces architecture
- ONE package.json controls everything
- AI cannot write bad code (literally impossible)

**The prison is built. Now code with confidence.** 🎯

---

## 📞 Support

This is a **maximum enforcement template** built for rapid, safe development.

**Key Principle:** Make wrong code impossible, not just discouraged.

---

## License

MIT

## Author

Jessica Johnson <2334167+jessifoo@users.noreply.github.com>
