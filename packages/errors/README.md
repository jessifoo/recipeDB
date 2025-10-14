# @app/errors

**Clean Code Error Handling - Layer-Based Pattern**

## ✅ The CORRECT Way (Errors at Layer Boundaries)

### 1. **Domain Layer: Throw Domain Errors**

```typescript
export class UserService {
  async createUser(data: UserInput): Promise<User> {
    // Domain validation
    if (!data.email) {
      throw new ValidationError('Email is required');
    }

    // Check business rules
    const exists = await this.repository.findByEmail(data.email);
    if (exists) {
      throw new ValidationError('Email already exists');
    }

    // Try operation
    try {
      return await this.repository.create(data);
    } catch (error) {
      // Re-throw as domain error
      throw new DatabaseError('Failed to create user', { cause: error });
    }
  }
}
```

### 2. **API Layer: Catch and Convert to HTTP**

```typescript
// tRPC router
export const userRouter = router({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      try {
        const validated = validate(createUserSchema, input);
        return await userService.create(validated);
      } catch (error) {
        // Convert domain errors to tRPC errors
        if (error instanceof ValidationError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }
        if (error instanceof NotFoundError) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: error.message,
          });
        }
        // Unknown error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }),
});
```

### 3. **UI Layer: Error Boundaries**

```typescript
// React Error Boundary
<ErrorBoundary fallback={<ErrorPage />}>
  <YourApp />
</ErrorBoundary>
```

---

## ❌ ANTI-PATTERN: Central Error Handler

```typescript
// ❌ WRONG - God function that handles all errors everywhere
function handleError(error: unknown) {
  // This creates tight coupling and violates SRP
  if (error instanceof ValidationError) { ... }
  if (error instanceof DatabaseError) { ... }
  // etc...
}

// Then everywhere:
try {
  // do stuff
} catch (error) {
  handleError(error); // Bad! Hidden complexity
}
```

**Why this is bad:**
- Violates Single Responsibility (one function does too much)
- Violates Open/Closed (must modify function for new error types)
- Tight coupling (everything depends on this function)
- Hides error handling logic (not clear what happens)

---

## ✅ Clean Architecture Error Flow

```
UI Layer (React)
  ↓ displays errors
  ↑ throws domain errors
  
API Layer (tRPC/REST)
  ↓ converts to HTTP codes
  ↑ throws domain errors
  
Service Layer (Business Logic)
  ↓ throws domain errors
  ↑ throws domain errors
  
Repository Layer (Data Access)
  ↓ throws technical errors (DB, network)
  ↑ caught by service, re-thrown as domain errors
```

**Key principle:** Handle errors at architectural boundaries, not in one central place.

---

## 🏗️ Domain Errors (Type-Safe)

```typescript
// Each domain has its own errors
export class UserNotFoundError extends NotFoundError {
  constructor(userId: string) {
    super('User', userId);
  }
}

export class InvalidEmailError extends ValidationError {
  constructor(email: string) {
    super('Invalid email format', { email });
  }
}

// Use them in your domain
if (!isValidEmail(data.email)) {
  throw new InvalidEmailError(data.email);
}
```

**Benefits:**
- Type-safe (can catch specific errors)
- Self-documenting (error names are meaningful)
- Domain-specific (not generic)

---

## 🎯 Error Handling by Layer

### Service Layer
```typescript
export class UserService {
  async getUser(id: UserId): Promise<User> {
    const user = await this.repository.findById(id);
    
    if (!user) {
      throw new UserNotFoundError(id); // Domain error
    }
    
    return user;
  }
}
```

### API Layer (tRPC)
```typescript
export const userRouter = router({
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        return await userService.getUser(UserId(input));
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          throw new TRPCError({ code: 'NOT_FOUND', message: error.message });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
});
```

### UI Layer (React)
```typescript
export function UserProfile({ userId }: Props) {
  const { data, error, isLoading } = trpc.user.getById.useQuery(userId);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{data.name}</div>;
}
```

---

## 🚀 Result Pattern (Alternative)

Instead of throwing, return Result:

```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export class UserService {
  async getUser(id: UserId): Promise<Result<User, UserNotFoundError>> {
    const user = await this.repository.findById(id);
    
    if (!user) {
      return { success: false, error: new UserNotFoundError(id) };
    }
    
    return { success: true, data: user };
  }
}

// Usage
const result = await userService.getUser(id);

if (result.success) {
  console.log(result.data); // Type: User
} else {
  console.log(result.error); // Type: UserNotFoundError
}
```

**Benefits:**
- Explicit error handling (can't forget)
- Type-safe (TypeScript knows which fields exist)
- No try/catch needed

---

## 💡 Summary

**Clean Code Error Handling:**
1. **Domain Layer**: Throw domain-specific errors
2. **API Layer**: Catch domain errors, convert to HTTP/tRPC errors
3. **UI Layer**: Display errors to user
4. **NO central handler** - handle at appropriate layer

**Key Principles:**
- Errors are part of your domain model
- Handle errors at architectural boundaries
- Make errors explicit (Result pattern or throws)
- Use type-safe error classes
