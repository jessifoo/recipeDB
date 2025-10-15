# 🧹 Clean Code Principles - What We Actually Enforce

## ❌ What "Centralized" DOESN'T Mean

**NOT this (Anti-patterns):**
- ❌ Singleton pattern (global state)
- ❌ God objects (one class does everything)
- ❌ Central handlers (one function for all errors)
- ❌ Global imports (`import { logger } from ...` everywhere)

---

## ✅ What "Centralized" DOES Mean

**THIS (Clean Code):**
- ✅ **Single interface** - One `ILogger` interface
- ✅ **Dependency Injection** - Services declare dependencies
- ✅ **Composition Root** - Wire dependencies in one place
- ✅ **Layer boundaries** - Handle concerns at appropriate layer

---

## 🏗️ Clean Architecture Principles

### 1. **Dependency Inversion Principle**

```typescript
// ✅ CORRECT - Depend on abstraction
import type { ILogger } from '@app/logger';

export class UserService {
  constructor(private logger: ILogger) {} // Interface, not concrete class
}

// ❌ WRONG - Depend on concretion
import { logger } from '@app/logger'; // Concrete singleton

export class UserService {
  doSomething() {
    logger.info('...'); // Hidden dependency on global
  }
}
```

### 2. **Single Responsibility Principle**

```typescript
// ✅ CORRECT - Each layer has ONE job
class UserService {
  // ONLY business logic
  async createUser(data: UserInput): Promise<User> {
    if (await this.exists(data.email)) {
      throw new ValidationError('Email exists');
    }
    return this.repository.create(data);
  }
}

class UserRepository {
  // ONLY data access
  async create(data: UserInput): Promise<User> {
    return db.user.create({ data });
  }
}

class UserController {
  // ONLY HTTP concerns
  async create(req, res) {
    try {
      const user = await this.userService.createUser(req.body);
      res.json(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      }
    }
  }
}

// ❌ WRONG - Service handles HTTP
class UserService {
  async createUser(req, res) { // NO! HTTP in service layer
    // ...
    res.json(user); // NO! This is controller's job
  }
}
```

### 3. **Interface Segregation Principle**

```typescript
// ✅ CORRECT - Small, focused interfaces
interface ILogger {
  info(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
}

// If you only need logging, you only depend on ILogger
// If you only need metrics, you depend on IMetrics
// Don't force services to depend on interfaces they don't use

// ❌ WRONG - Fat interface
interface IGodService {
  log(): void;
  sendEmail(): void;
  saveToDatabase(): void;
  renderHTML(): void;
  // Service must implement ALL of these even if it only needs log
}
```

### 4. **Open/Closed Principle**

```typescript
// ✅ CORRECT - Open for extension, closed for modification
interface ILogger { ... }

class ConsoleLogger implements ILogger { ... }
class FileLogger implements ILogger { ... }
class DatadogLogger implements ILogger { ... }

// Add new logger? Just implement ILogger
// NO need to modify existing code

// ❌ WRONG - Must modify for each new type
function handleError(error: unknown) {
  if (error instanceof ValidationError) { ... }
  if (error instanceof DatabaseError) { ... }
  // Add new error? Must modify this function
}
```

---

## 🎯 Practical Patterns

### Pattern 1: Constructor Injection

```typescript
// Service declares what it needs
export class UserService {
  constructor(
    private readonly logger: ILogger,
    private readonly repository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}
  
  async createUser(data: UserInput): Promise<User> {
    this.logger.info('Creating user');
    const user = await this.repository.create(data);
    await this.emailService.sendWelcome(user.email);
    return user;
  }
}
```

**Benefits:**
- ✅ Explicit dependencies (visible in constructor)
- ✅ Easy to test (inject mocks)
- ✅ Easy to swap implementations
- ✅ No hidden global state

### Pattern 2: Composition Root

```typescript
// Wire everything in ONE place
export function createApp() {
  // Infrastructure
  const logger = createLogger();
  const db = createDatabase();
  
  // Repositories
  const userRepository = new UserRepository(db);
  const emailService = new EmailService();
  
  // Services
  const userService = new UserService(
    logger,
    userRepository,
    emailService
  );
  
  // API
  const userRouter = createUserRouter(userService);
  
  return { userRouter };
}
```

**Benefits:**
- ✅ All dependencies in one place
- ✅ Easy to see the whole graph
- ✅ Easy to change wiring
- ✅ Services don't know about construction

### Pattern 3: Error Handling at Boundaries

```typescript
// Domain layer: Throw domain errors
class UserService {
  async getUser(id: UserId): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id); // Domain error
    }
    return user;
  }
}

// API layer: Convert to HTTP/tRPC errors
const userRouter = router({
  getById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      try {
        return await userService.getUser(UserId(input));
      } catch (error) {
        // Handle AT THE BOUNDARY
        if (error instanceof UserNotFoundError) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
});

// UI layer: Display errors
function UserProfile({ userId }) {
  const { data, error } = trpc.user.getById.useQuery(userId);
  
  if (error) return <ErrorMessage error={error} />;
  return <div>{data.name}</div>;
}
```

**Benefits:**
- ✅ Each layer handles its concerns
- ✅ No "god" error handler
- ✅ Clear responsibility
- ✅ Easy to understand flow

---

## 🚫 Anti-Patterns We AVOID

### 1. Singleton Pattern
```typescript
// ❌ BAD
class Logger {
  private static instance: Logger;
  static getInstance() { ... }
}
const logger = Logger.getInstance();

// ✅ GOOD
class ConsoleLogger implements ILogger { ... }
// Inject it where needed
```

### 2. God Objects
```typescript
// ❌ BAD
class AppService {
  createUser() { ... }
  sendEmail() { ... }
  processPayment() { ... }
  generateReport() { ... }
  // Does everything!
}

// ✅ GOOD
class UserService { createUser() { ... } }
class EmailService { sendEmail() { ... } }
class PaymentService { processPayment() { ... } }
class ReportService { generateReport() { ... } }
// Each does ONE thing
```

### 3. Hidden Dependencies
```typescript
// ❌ BAD
import { logger } from '@app/logger'; // Hidden global

class UserService {
  createUser() {
    logger.info('...'); // Where did logger come from?
  }
}

// ✅ GOOD
class UserService {
  constructor(private logger: ILogger) {} // Explicit!
  
  createUser() {
    this.logger.info('...');
  }
}
```

---

## 📊 The Clean Code Stack

```
Composition Root (creates & wires)
  ↓
Controllers/Routers (HTTP/tRPC concerns)
  ↓
Services (business logic)
  ↓
Repositories (data access)
  ↓
Infrastructure (database, logger, etc.)
```

**Each layer:**
- ✅ Has ONE responsibility
- ✅ Depends on abstractions (interfaces)
- ✅ Declares dependencies explicitly
- ✅ Is easy to test (inject mocks)
- ✅ Is easy to swap (different implementations)

---

## 💡 Key Takeaways

1. **"Centralized" = Interface, not Singleton**
   - Define interface once
   - Inject implementations
   - No global state

2. **Dependencies are explicit**
   - Declared in constructor
   - Visible to everyone
   - Easy to test

3. **Each layer has ONE job**
   - Services: Business logic
   - Repositories: Data access
   - Controllers: HTTP concerns
   - UI: Display

4. **Handle concerns at boundaries**
   - Don't create "god" handlers
   - Each layer converts errors to its format
   - Keep logic at appropriate layer

**This is Clean Code. This is what we enforce.** ✅
