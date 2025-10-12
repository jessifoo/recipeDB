# Quick Start - Anti-Chaos Development

## TL;DR

**This project prevents AI from creating logging chaos through automatic enforcement.**

### The Only Way to Log

```typescript
import { logger } from '@recipedb/logger';

logger.info('message', { optional: 'data' });
logger.error('error message', error);
logger.warn('warning', { context: 'here' });
logger.debug('debug info', { details: 'here' });
```

**Everything else is automatically blocked.**

---

## Immediate Setup (5 minutes)

```bash
# 1. Install and setup
pnpm install
pnpm run prepare

# 2. Verify enforcement works
pnpm validate:logging

# 3. Start coding
pnpm dev
```

---

## Quick Test - See It Work

### ❌ Test 1: Violation is Blocked

Create a file with console.log:

```bash
echo "console.log('test');" > test.ts
git add test.ts
git commit -m "test"
```

**Result:** ❌ Commit blocked by ESLint

---

### ✅ Test 2: Correct Pattern Works

Create file with proper logger:

```typescript
// test-correct.ts
import { logger } from '@recipedb/logger';
logger.info('This works!');
```

```bash
git add test-correct.ts
git commit -m "test"
```

**Result:** ✅ Commit succeeds

---

## Key Files

| File | Purpose |
|------|---------|
| `AI_CODING_RULES.md` | Rules for AI (read first!) |
| `ARCHITECTURE.md` | System design & patterns |
| `EXAMPLES.md` | Copy-paste examples |
| `ANTI_CHAOS_SETUP.md` | Detailed setup explanation |
| `packages/logger/` | The ONLY logger allowed |

---

## Using with AI

### Starting a Session

Tell AI:

> "Read AI_CODING_RULES.md. Use `import { logger } from '@recipedb/logger'` for ALL logging. Never use console.log or create logger files."

### In Prompts

Add this to every coding request:

```
RULES:
- Use @recipedb/logger for logging
- No console.log anywhere
- No new logger files
```

---

## What's Enforced

✅ **Automatic Enforcement (AI can't bypass):**
- No console.log/error/warn anywhere
- No winston, pino, bunyan imports
- No files named logger.ts, log.ts, logging.ts
- Must use @recipedb/logger

❌ **AI Cannot:**
- Create multiple loggers
- Use console methods
- Import external logging libs
- Create logging utility files

✅ **AI Must:**
- Import from @recipedb/logger
- Use logger.info/error/warn/debug
- Follow centralized pattern

---

## Enforcement Layers

```
Your Code
    ↓
ESLint (immediate feedback in IDE)
    ↓
TypeScript (compile-time checking)
    ↓
Pre-commit Hook (blocks bad commits)
    ↓
Git Repository (only good code enters)
```

**Every layer catches violations automatically.**

---

## Daily Workflow

```bash
# Code normally
# AI or you write code using logger

# Before commit (optional - hooks do this)
pnpm validate

# Commit (automatic checks run)
git commit -m "message"

# If violation found:
# - See clear error message
# - Fix the issue
# - Commit again
```

---

## Troubleshooting

### ESLint not running?
```bash
pnpm lint
```

### Pre-commit hook not working?
```bash
pnpm run prepare
```

### Want to see all violations?
```bash
pnpm validate:logging
```

### Check specific file?
```bash
npx eslint path/to/file.ts
```

---

## Expanding the Pattern

Same approach for other concerns:

### Future: Database
```typescript
import { db } from '@recipedb/database';
```

### Future: Validation
```typescript
import { schemas } from '@recipedb/validation';
```

### Future: Auth
```typescript
import { auth } from '@recipedb/auth';
```

**Each gets:**
- Centralized package
- ESLint enforcement
- Pre-commit validation
- Clear documentation

---

## Success Indicators

You'll know it's working when:

1. ✅ ESLint shows errors for console.log
2. ✅ Pre-commit hook blocks bad commits
3. ✅ Import autocomplete shows @recipedb/logger
4. ✅ All logs have consistent format
5. ✅ No logger files in wrong places

---

## Help

- **Error messages unclear?** Check `AI_CODING_RULES.md`
- **How to use logger?** Check `EXAMPLES.md`
- **Why these rules?** Check `ARCHITECTURE.md`
- **Setup issues?** Check `ANTI_CHAOS_SETUP.md`

---

## Remember

**The goal:** Make it impossible for AI (or humans) to create chaos.

**The method:** Automatic enforcement at every level.

**The result:** Consistent, maintainable code.

🎯 **You're all set! Start coding with guardrails.**
