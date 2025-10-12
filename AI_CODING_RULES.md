# AI CODING RULES - READ THIS FIRST

**These rules are AUTOMATICALLY ENFORCED by ESLint, TypeScript, and pre-commit hooks.**

## 🚨 CRITICAL: CENTRALIZED SYSTEMS (DO NOT VIOLATE)

### Logging - SINGLE SOURCE OF TRUTH

**✅ ALWAYS DO THIS:**
```typescript
import { logger } from '@recipedb/logger';

logger.info('User logged in', { userId: 123 });
logger.error('Failed to save', error);
logger.warn('Cache miss', { key: 'user:123' });
logger.debug('Query executed', { sql: 'SELECT ...' });
```

**❌ NEVER DO THIS:**
```typescript
// ❌ FORBIDDEN - Will fail ESLint
console.log('anything');
console.error('anything');

// ❌ FORBIDDEN - Will fail ESLint
import winston from 'winston';
import pino from 'pino';

// ❌ FORBIDDEN - Will fail pre-commit hook
// Creating files named: logger.ts, log.ts, logging.ts, etc.
```

### Why This Matters

In this codebase:
- **ONE logger location**: `packages/logger/src/index.ts`
- **ONE way to log**: `import { logger } from '@recipedb/logger'`
- **NO exceptions**: Even quick debugging must use the logger

### Enforcement Layers

1. **ESLint**: Blocks `console.*` and external logger imports
2. **Pre-commit hook**: Scans for logging file names and patterns
3. **TypeScript**: Only `@recipedb/logger` is in import paths
4. **Code review**: Human verification

### If You Need to Add Logging Functionality

1. DO NOT create a new file
2. DO edit `packages/logger/src/index.ts`
3. Add your feature to the centralized Logger class
4. Export it from the same file
5. Update `packages/logger/README.md`

## 📋 Other Centralized Patterns (To Be Established)

Future centralized systems will follow the same pattern:
- `@recipedb/database` - Single database client
- `@recipedb/validation` - Single validation system
- `@recipedb/auth` - Single auth system

**The pattern is:**
1. ONE package in `packages/[name]/`
2. ONE export from `src/index.ts`
3. ESLint rules preventing alternatives
4. Pre-commit hook validation
5. Documentation in package README

## 🔧 Quick Reference

**Before writing ANY code, ask:**
- "Does a centralized system exist for this?"
- "Am I about to create a duplicate file/system?"
- "Should I add to existing infrastructure instead?"

**If unsure:**
1. Check `packages/` directory
2. Check `tsconfig.base.json` paths
3. Search for existing implementations
4. Ask before creating new infrastructure

## 🚀 Development Workflow

```bash
# Before committing
npm run validate

# Check logging specifically
npm run validate:logging

# The commit will auto-run these checks
git commit -m "message"
```

## ⚡ Key Principle

**"Centralize once, enforce everywhere"**

This prevents the chaos of multiple implementations, duplicate code, and conflicting patterns.
