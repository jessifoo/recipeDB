# @app/config

Type-safe environment variables and application constants.

## Usage

### Environment Variables

```typescript
import { env } from '@app/config';

// ✅ Type-safe, validated at runtime
console.log(env.DATABASE_URL);      // string (validated as URL)
console.log(env.NODE_ENV);          // "development" | "test" | "production"
console.log(env.NEXTAUTH_SECRET);   // string (min 32 chars)

// ❌ TypeScript error - variable doesn't exist
console.log(env.NONEXISTENT);
```

### Constants

```typescript
import { PAGINATION, CACHE_TTL, SESSION } from '@app/config';

// Pagination
const limit = PAGINATION.DEFAULT_LIMIT;  // 20
const maxLimit = PAGINATION.MAX_LIMIT;   // 100

// Cache TTLs
await cache.set(key, value, { ttl: CACHE_TTL.MEDIUM }); // 5 minutes

// Session
maxAge: SESSION.MAX_AGE  // 30 days
```

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp packages/config/.env.example .env
   ```

2. Fill in required values:
   ```bash
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="generate-random-32+-chars"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. Environment is validated on app startup

## Adding Environment Variables

Edit `packages/config/src/env.ts`:

```typescript
export const env = createEnv({
  server: {
    // Add server-only variables here
    MY_API_KEY: z.string().min(1),
  },
  client: {
    // Add client-exposed variables here (NEXT_PUBLIC_*)
    NEXT_PUBLIC_MY_VAR: z.string(),
  },
  runtimeEnv: {
    // Map process.env
    MY_API_KEY: process.env.MY_API_KEY,
    NEXT_PUBLIC_MY_VAR: process.env.NEXT_PUBLIC_MY_VAR,
  },
});
```

## Adding Constants

Edit `packages/config/src/constants.ts`:

```typescript
export const MY_FEATURE = {
  SOME_LIMIT: 100,
  SOME_DEFAULT: 'value',
} as const;
```

## Rules

❌ **DO NOT** use `process.env.*` directly
❌ **DO NOT** hardcode magic numbers/strings
✅ **DO** import from `@app/config`
✅ **DO** add new env vars to this package
✅ **DO** add constants here
