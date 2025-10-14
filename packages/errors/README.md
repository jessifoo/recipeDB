# @app/errors

**ONE place for error handling logic, used at appropriate boundaries.**

## ✅ The Solution: Error Utilities

**You have ONE file with ALL error handling logic:**
- `packages/errors/error-utils.ts`

**Each layer imports and uses the appropriate utility:**

### API Layer (tRPC)
```typescript
import { toTrpcError } from '@app/errors';

export const userRouter = router({
  create: publicProcedure
    .mutation(async ({ input, ctx }) => {
      try {
        return await ctx.userService.create(input);
      } catch (error) {
        // ONE utility, ONE place, ALL logic
        throw new TRPCError(toTrpcError(error));
      }
    }),
});
```

### API Layer (REST)
```typescript
import { toHttpError } from '@app/errors';

app.post('/users', async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.json(user);
  } catch (error) {
    // ONE utility, ONE place, ALL logic
    const httpError = toHttpError(error);
    res.status(httpError.status).json(httpError.body);
  }
});
```

### UI Layer
```typescript
import { toUserMessage } from '@app/errors';

function UserProfile() {
  const { error } = trpc.user.getById.useQuery(id);

  if (error) {
    // ONE utility, ONE place, ALL logic
    return <ErrorMessage>{toUserMessage(error)}</ErrorMessage>;
  }
}
```

---

## 🎯 The Key Insight

**You DON'T have:**
- ❌ One handler function called everywhere
- ❌ God object that does everything
- ❌ Tight coupling

**You DO have:**
- ✅ One file with error conversion logic (`error-utils.ts`)
- ✅ Utilities used at appropriate boundaries
- ✅ Each layer handles its own concerns
- ✅ Clean separation of responsibilities

---

## 📦 Available Utilities

### `toTrpcError(error: unknown)`
Converts domain errors to tRPC errors.

```typescript
import { toTrpcError } from '@app/errors';

try {
  await service.doSomething();
} catch (error) {
  throw new TRPCError(toTrpcError(error));
}
```

### `toHttpError(error: unknown)`
Converts domain errors to HTTP responses.

```typescript
import { toHttpError } from '@app/errors';

try {
  await service.doSomething();
} catch (error) {
  const { status, body } = toHttpError(error);
  res.status(status).json(body);
}
```

### `toUserMessage(error: unknown)`
Converts errors to user-friendly messages.

```typescript
import { toUserMessage } from '@app/errors';

if (error) {
  toast.error(toUserMessage(error));
}
```

### `shouldLog(error: unknown)`
Determines if error should be logged.

```typescript
import { shouldLog } from '@app/errors';

if (shouldLog(error)) {
  logger.error('Unexpected error', error);
}
```

### `shouldReport(error: unknown)`
Determines if error should be reported to monitoring.

```typescript
import { shouldReport } from '@app/errors';

if (shouldReport(error)) {
  Sentry.captureException(error);
}
```

---

## 🏗️ Architecture

```
error-utils.ts (ONE file with ALL logic)
       ↓
   ┌───┴────┬─────────┬──────────┐
   ↓        ↓         ↓          ↓
tRPC    REST API    UI Layer  Monitoring
layer    layer       layer      layer

Each layer uses the appropriate utility
```

**Benefits:**
- ✅ ONE place to maintain error handling logic
- ✅ Consistent error handling everywhere
- ✅ Each layer handles at its boundary
- ✅ Easy to test (utilities are pure functions)
- ✅ Easy to extend (add new error type, update utilities)

---

## 💡 Adding New Error Types

1. Create error class:
```typescript
// packages/errors/rate-limit-error.ts
export class RateLimitError extends BaseError {
  constructor(limit: number) {
    super('Rate limit exceeded', 'RATE_LIMIT', 429, true, { limit });
  }
}
```

2. Update utilities (ONE place):
```typescript
// packages/errors/error-utils.ts
export function toTrpcError(error: unknown) {
  // ... existing errors
  
  if (error instanceof RateLimitError) {
    return { code: 'TOO_MANY_REQUESTS', message: error.message };
  }
  
  // ... rest
}

export function toHttpError(error: unknown) {
  // ... existing errors
  
  if (error instanceof RateLimitError) {
    return { status: 429, body: { error: error.code } };
  }
  
  // ... rest
}
```

3. Done! All layers now handle the new error correctly.

---

## 🎯 Summary

**This IS centralized error handling:**
- ✅ ONE file with ALL conversion logic
- ✅ Used at appropriate boundaries
- ✅ Clean, maintainable, testable

**This is NOT:**
- ❌ A singleton
- ❌ A god object
- ❌ Global state

**The logic is centralized, the usage is decentralized.** That's Clean Code. 🧹
