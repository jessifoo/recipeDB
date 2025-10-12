# @recipedb/logger

**THE ONLY LOGGING SYSTEM ALLOWED IN THIS CODEBASE**

## Usage

```typescript
import { logger } from '@recipedb/logger';

// Basic logging
logger.info('User logged in', { userId: 123 });
logger.warn('Rate limit approaching', { remaining: 10 });
logger.error('Database connection failed', error);
logger.debug('Query executed', { sql: 'SELECT ...', duration: 45 });
```

## Rules

### ⛔ FORBIDDEN - DO NOT DO THIS

```typescript
// ❌ NO console.log anywhere
console.log('something');

// ❌ NO creating new logger files
// log.ts, logger.ts, logging.ts, utils/log.ts, etc.

// ❌ NO importing other logging libraries
import winston from 'winston';
import pino from 'pino';
```

### ✅ REQUIRED - ALWAYS DO THIS

```typescript
// ✅ Import the centralized logger
import { logger } from '@recipedb/logger';

// ✅ Use the appropriate method
logger.info('message', { optional: 'data' });
```

## Enforcement

This is enforced by:
1. ESLint `no-console` rule
2. ESLint `no-restricted-imports` for logging libraries
3. Nx module boundaries
4. Pre-commit hooks that scan for violations
5. TypeScript import path restrictions

**If you try to violate these rules, your code will not pass CI/linting.**
