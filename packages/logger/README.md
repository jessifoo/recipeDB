# @app/logger

**THE ONLY LOGGING SYSTEM ALLOWED IN THIS CODEBASE**

## Usage

```typescript
import { logger } from '@app/logger';
import { LogLevel } from '@app/types';

// Basic logging
logger.info('User logged in', { userId: 123 });
logger.warn('Rate limit approaching', { remaining: 10 });
logger.error('Database connection failed', error);
logger.debug('Query executed', { sql: 'SELECT ...', duration: 45 });

// Set log level
logger.setLevel(LogLevel.DEBUG);
```

## Rules

### ⛔ FORBIDDEN

```typescript
// ❌ NO console.log anywhere
console.log('something');

// ❌ NO creating new logger files
// log.ts, logger.ts, logging.ts, utils/log.ts

// ❌ NO importing other logging libraries
import winston from 'winston';
import pino from 'pino';
```

### ✅ REQUIRED

```typescript
// ✅ Import the centralized logger
import { logger } from '@app/logger';

// ✅ Use the appropriate method
logger.info('message', { optional: 'data' });
```

## Enforcement

This is enforced by:
1. ESLint `no-console` rule (error)
2. ESLint `no-restricted-imports` for logging libraries
3. Pre-commit hook scans for violations
4. TypeScript import path restrictions

**If you try to violate these rules, your code will not pass linting or commit.**

## Log Levels

- `ERROR`: Errors that need immediate attention
- `WARN`: Warnings that should be investigated
- `INFO`: General information (default)
- `DEBUG`: Detailed debugging information

## Features

- Singleton pattern (one instance)
- Automatic module detection
- Timestamp in ISO format
- JSON formatting for data objects
- Configurable log levels
- Type-safe with TypeScript
