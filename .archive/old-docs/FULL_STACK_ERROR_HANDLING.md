# 🧹 Clean Code Full-Stack Error Handling

## 🎯 The Architecture

**Each layer handles errors at its boundary. No central handler.**

```
UI Layer       → Display to user
    ↑ HTTP/tRPC errors
API Layer      → Convert domain → HTTP
    ↑ Domain errors  
Service Layer  → Business logic errors
    ↑ Domain errors
Repository     → Data access errors
    ↑ Low-level errors
Database       → Technical errors
```

---

## ✅ Layer 1: Domain Errors (Service Layer)

### Define Domain-Specific Errors

```typescript
// packages/domain/user/user.errors.ts
import { NotFoundError, ValidationError } from '@app/errors';

export class UserNotFoundError extends NotFoundError {
  constructor(userId: string) {
    super('User', userId);
  }
}

export class EmailAlreadyExistsError extends ValidationError {
  constructor(email: string) {
    super('Email already exists', { email });
  }
}

export class InsufficientPermissionsError extends BaseError {
  constructor(action: string) {
    super(`Insufficient permissions for: ${action}`, 'FORBIDDEN', 403);
  }
}
```

### Service Throws Domain Errors

```typescript
// packages/domain/user/user.service.ts
import type { ILogger } from '@app/logger';
import type { IUserRepository } from './user.repository';
import { UserNotFoundError, EmailAlreadyExistsError } from './user.errors';

export class UserService {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository
  ) {}

  async createUser(data: CreateUserInput): Promise<User> {
    this.logger.info('Creating user', { email: data.email });

    // Check business rules
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new EmailAlreadyExistsError(data.email);
    }

    // Try to create
    try {
      const user = await this.repository.create(data);
      this.logger.info('User created', { id: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      // Re-throw as domain error
      throw new DatabaseError('Failed to create user', { cause: error });
    }
  }

  async getUserById(id: UserId): Promise<User> {
    const user = await this.repository.findById(id);
    
    if (!user) {
      throw new UserNotFoundError(id);
    }
    
    return user;
  }

  async deleteUser(id: UserId, requesterId: UserId): Promise<void> {
    // Business rule: Can only delete own account
    if (id !== requesterId) {
      throw new InsufficientPermissionsError('delete user');
    }

    const user = await this.getUserById(id); // Throws if not found
    
    try {
      await this.repository.delete(id);
      this.logger.info('User deleted', { id });
    } catch (error) {
      this.logger.error('Failed to delete user', error);
      throw new DatabaseError('Failed to delete user', { cause: error });
    }
  }
}
```

**Notice:**
- ✅ Service throws **domain-specific** errors
- ✅ Service doesn't know about HTTP codes
- ✅ Service doesn't handle formatting
- ✅ Service just does business logic

---

## ✅ Layer 2: API Layer (HTTP/tRPC)

### Convert Domain Errors to API Errors

```typescript
// packages/api/routers/user.router.ts
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { 
  UserNotFoundError, 
  EmailAlreadyExistsError,
  InsufficientPermissionsError 
} from '@app/domain/user';

export const userRouter = router({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const validated = validate(createUserSchema, input);
        return await ctx.userService.createUser(validated);
      } catch (error) {
        // Convert domain errors to tRPC errors AT THE BOUNDARY
        if (error instanceof EmailAlreadyExistsError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
            cause: error,
          });
        }
        if (error instanceof DatabaseError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create user',
          });
        }
        // Unknown error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }),

  getById: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        return await ctx.userService.getUserById(UserId(input));
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: error.message,
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
        });
      }
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = UserId(input);
        const requesterId = ctx.session?.user?.id;
        
        await ctx.userService.deleteUser(userId, requesterId);
        return { success: true };
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        if (error instanceof InsufficientPermissionsError) {
          throw new TRPCError({ 
            code: 'FORBIDDEN',
            message: error.message,
          });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
});
```

**Notice:**
- ✅ API layer knows about HTTP codes
- ✅ Converts domain errors to tRPC/HTTP errors
- ✅ Doesn't create domain errors itself
- ✅ Handles errors AT THE BOUNDARY

---

## ✅ Layer 3: UI Layer (React)

### Display Errors to User

```typescript
// apps/web/src/components/UserProfile.tsx
'use client';

import { trpc } from '@/lib/trpc';

export function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = trpc.user.getById.useQuery(userId);

  // Loading state
  if (isLoading) {
    return <Spinner />;
  }

  // Error state
  if (error) {
    // Error already formatted by tRPC layer
    if (error.data?.code === 'NOT_FOUND') {
      return <NotFoundMessage message="User not found" />;
    }
    if (error.data?.code === 'FORBIDDEN') {
      return <ErrorMessage message="Access denied" />;
    }
    return <ErrorMessage message="Something went wrong" />;
  }

  // Success state
  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

### React Error Boundary (For Render Errors)

```typescript
// apps/web/src/app/layout.tsx
import { ErrorBoundary } from '@app/errors';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorPage error={error} onReset={reset} />
          )}
        >
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### Form Error Handling

```typescript
// apps/web/src/components/CreateUserForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/lib/trpc';
import { createUserSchema } from '@app/validation';

export function CreateUserForm() {
  const { register, handleSubmit, setError } = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const createUser = trpc.user.create.useMutation({
    onError: (error) => {
      // Handle specific errors
      if (error.data?.code === 'BAD_REQUEST') {
        if (error.message.includes('Email already exists')) {
          setError('email', { message: 'This email is already taken' });
        }
      }
    },
    onSuccess: () => {
      // Redirect or show success
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => createUser.mutate(data))}>
      <input {...register('email')} />
      {createUser.error && (
        <ErrorMessage>{createUser.error.message}</ErrorMessage>
      )}
      <button type="submit">Create User</button>
    </form>
  );
}
```

---

## 🎯 Error Flow Example

### User tries to create account with existing email:

**1. UI Layer:**
```typescript
createUser.mutate({ email: 'taken@example.com' })
```

**2. API Layer (tRPC):**
```typescript
// Receives request
try {
  await userService.createUser(data);
} catch (error) {
  // EmailAlreadyExistsError thrown by service
  if (error instanceof EmailAlreadyExistsError) {
    throw new TRPCError({ code: 'BAD_REQUEST', ... });
  }
}
```

**3. Service Layer:**
```typescript
const existing = await repository.findByEmail(email);
if (existing) {
  throw new EmailAlreadyExistsError(email); // Throws here!
}
```

**4. Back to UI:**
```typescript
onError: (error) => {
  if (error.data?.code === 'BAD_REQUEST') {
    setError('email', { message: 'Email already taken' });
  }
}
```

**Flow:**
```
User submits form
  → tRPC mutation
    → Service throws EmailAlreadyExistsError
      → API converts to TRPCError (BAD_REQUEST)
        → UI displays form error
```

---

## 🚫 Anti-Pattern: Central Error Handler

### ❌ WRONG - God Function

```typescript
// ❌ DON'T DO THIS
function handleError(error: unknown) {
  if (error instanceof ValidationError) {
    return { status: 400, message: error.message };
  }
  if (error instanceof NotFoundError) {
    return { status: 404, message: error.message };
  }
  if (error instanceof DatabaseError) {
    return { status: 500, message: 'Internal error' };
  }
  // etc...
}

// Then use it everywhere:
try {
  await doSomething();
} catch (error) {
  const response = handleError(error); // BAD!
  return res.status(response.status).json(response);
}
```

**Problems:**
- Violates Single Responsibility (one function does too much)
- Violates Open/Closed (must modify for new errors)
- Tight coupling (everything depends on this)
- Loses context (generic handling)

### ✅ CORRECT - Handle at Boundaries

```typescript
// Service layer: Throw domain errors
class UserService {
  async create(data) {
    if (exists) throw new EmailAlreadyExistsError(email);
  }
}

// API layer: Convert to HTTP
const router = {
  create: async (req, res) => {
    try {
      await service.create(data);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal error' });
    }
  }
}

// UI layer: Display to user
const { error } = useMutation();
if (error?.code === 'BAD_REQUEST') {
  return <FormError>{error.message}</FormError>;
}
```

---

## 💡 Best Practices

### 1. **Create Domain-Specific Errors**

```typescript
// Generic (BAD)
throw new Error('User not found');

// Domain-specific (GOOD)
throw new UserNotFoundError(userId);
```

### 2. **Handle at Appropriate Layer**

```typescript
// Service: Throws domain errors
class UserService {
  async delete(id: UserId) {
    const user = await this.findById(id);
    if (!user) throw new UserNotFoundError(id);
  }
}

// API: Converts to HTTP
router.delete(async (req) => {
  try {
    await service.delete(id);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return res.status(404).json(...);
    }
  }
});

// UI: Displays to user
if (error?.code === 'NOT_FOUND') {
  return <NotFoundPage />;
}
```

### 3. **Use Type-Safe Errors**

```typescript
// Can catch specific errors
try {
  await service.createUser(data);
} catch (error) {
  if (error instanceof EmailAlreadyExistsError) {
    // TypeScript knows error.email exists
    console.log(error.email);
  }
}
```

### 4. **Log at Service Layer**

```typescript
class UserService {
  constructor(private logger: ILogger) {}

  async createUser(data: UserInput) {
    this.logger.info('Creating user', { email: data.email });
    
    try {
      const user = await this.repository.create(data);
      this.logger.info('User created', { id: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new DatabaseError('Failed to create user', { cause: error });
    }
  }
}
```

---

## 📊 Summary

**Clean Code Error Handling:**

1. **Service Layer**: Throw domain errors
2. **API Layer**: Convert domain → HTTP/tRPC
3. **UI Layer**: Display to user
4. **NO central handler**: Each layer handles its concerns

**Each error has a journey:**
```
Service throws → API converts → UI displays
```

**Benefits:**
- ✅ Clear responsibility per layer
- ✅ Type-safe error handling
- ✅ Easy to test (mock at boundaries)
- ✅ Easy to understand (explicit flow)
- ✅ Easy to extend (add new errors without changing handlers)

**This is Clean Code error handling.** 🎯
