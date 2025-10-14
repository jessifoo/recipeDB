# @app/errors

**ONE file. ONE error class. ONE place for messages.**

## 📁 Structure

```
packages/errors/
  ├── errors.ts      ← EVERYTHING here
  └── index.ts       ← Just exports
```

That's it. Two files total.

---

## ✅ Usage

### Throw Errors (Service Layer)

```typescript
import { createError } from '@app/errors';

// Validation error
if (!email) {
  throw createError.validation('Email is required', { field: 'email' });
}

// Not found
const user = await db.user.findById(id);
if (!user) {
  throw createError.notFound('User', id);
}

// Database error
try {
  await db.user.create(data);
} catch (err) {
  throw createError.database('Failed to create user', err);
}

// Auth errors
throw createError.unauthenticated();
throw createError.forbidden('Admin access required');
```

### Convert Errors (API Layer)

```typescript
import { toTrpcError } from '@app/errors';

export const userRouter = router({
  create: publicProcedure
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.userService.create(input);
      } catch (error) {
        throw new TRPCError(toTrpcError(error)); // ONE utility
      }
    }),
});
```

### Display Errors (UI Layer)

```typescript
import { toUserMessage } from '@app/errors';

function UserProfile() {
  const { error } = trpc.user.getById.useQuery(id);
  
  if (error) {
    return <ErrorMessage>{toUserMessage(error)}</ErrorMessage>;
  }
}
```

---

## 📊 What's in `errors.ts`

### 1. Error Codes (ONE object)
```typescript
export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
```

### 2. Error Messages (ONE object)
```typescript
export const ErrorMessage = {
  VALIDATION_ERROR: 'Validation failed',
  NOT_FOUND: 'Resource not found',
  // ... all messages
} as const;
```

### 3. ONE Error Class
```typescript
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message?: string,
    public readonly statusCode: number = 500,
    public readonly context?: Record<string, unknown>
  ) { ... }
}
```

### 4. Factory Functions
```typescript
export const createError = {
  validation: (msg?, ctx?) => new AppError(...),
  notFound: (resource, id?) => new AppError(...),
  // ... etc
};
```

### 5. Conversion Utilities
```typescript
export function toTrpcError(error) { ... }
export function toHttpError(error) { ... }
export function toUserMessage(error) { ... }
```

---

## 🎯 Adding New Error

**ONE place to update:**

```typescript
// packages/errors/errors.ts

// 1. Add code
export const ErrorCode = {
  // ... existing
  RATE_LIMIT: 'RATE_LIMIT', // ← Add here
} as const;

// 2. Add message
export const ErrorMessage = {
  // ... existing
  RATE_LIMIT: 'Too many requests', // ← Add here
} as const;

// 3. Add factory (optional)
export const createError = {
  // ... existing
  rateLimit: () => new AppError(ErrorCode.RATE_LIMIT, undefined, 429), // ← Add here
};

// 4. Update converters if needed
export function toTrpcError(error: unknown) {
  if (error instanceof AppError) {
    const codeMap = {
      // ... existing
      429: 'TOO_MANY_REQUESTS', // ← Add here
    };
    // ...
  }
}
```

**Done!** Entire codebase now handles the new error.

---

## 📦 File Count

**Before:** 8 files
- base.ts
- validation-error.ts
- not-found-error.ts
- database-error.ts
- auth-error.ts
- error-utils.ts
- error-boundary.tsx
- index.ts

**After:** 2 files
- errors.ts (everything)
- index.ts (exports)

**73% fewer files.** ✅

---

## 💡 Philosophy

**ONE error class** - `AppError` with code + status
**ONE place for codes** - `ErrorCode` object
**ONE place for messages** - `ErrorMessage` object
**ONE place for logic** - Factory functions + converters

**Everything in ONE file.**

Simple. Clean. Easy to find. 🎯
