# @app/logger

**Clean Code Logging - Dependency Injection Pattern**

## ✅ The CORRECT Way (Dependency Injection)

### Define Your Service with Logger Dependency

```typescript
import type { ILogger } from '@app/logger';

export class UserService {
  // Inject logger via constructor (Clean Code!)
  constructor(private readonly logger: ILogger) {}

  async createUser(data: UserInput): Promise<User> {
    this.logger.info('Creating user', { email: data.email });
    
    try {
      const user = await this.repository.create(data);
      this.logger.info('User created', { id: user.id });
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw error;
    }
  }
}
```

### Wire Dependencies in Composition Root

```typescript
import { createLogger } from '@app/logger';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

// Composition root (e.g., in app initialization)
const logger = createLogger();
const userRepository = new UserRepository();
const userService = new UserService(logger, userRepository);
```

---

## ❌ ANTI-PATTERN: Singleton (Don't Do This!)

```typescript
// ❌ WRONG - Global state, tight coupling
import { logger } from '@app/logger';

export class UserService {
  async createUser(data: UserInput) {
    logger.info('Creating user'); // Tight coupling to concrete logger!
  }
}
```

**Why this is bad:**
- Global state (hard to test)
- Tight coupling (can't swap implementations)
- Hidden dependency (not visible in constructor)
- Violates Dependency Inversion Principle

---

## ✅ Benefits of Dependency Injection

### 1. **Easy Testing**
```typescript
// Mock logger in tests
const mockLogger: ILogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
};

const service = new UserService(mockLogger);
await service.createUser(data);

expect(mockLogger.info).toHaveBeenCalledWith('Creating user', ...);
```

### 2. **Swappable Implementations**
```typescript
// Development: Verbose console logger
const devLogger = createLogger(LogLevel.DEBUG);

// Production: Structured logger (e.g., to Datadog)
const prodLogger = new DatadogLogger();

// Same interface, different implementation
const service = new UserService(devLogger); // or prodLogger
```

### 3. **Explicit Dependencies**
```typescript
// You can SEE what the service needs
constructor(
  private readonly logger: ILogger,
  private readonly repository: IRepository,
  private readonly cache: ICache
) {}
```

---

## 🏗️ Clean Architecture Layers

```
Application Layer (Composition Root)
  ↓ creates & injects
Service Layer (Business Logic)
  ↓ uses via interface
Logger Implementation (Infrastructure)
```

**Key principle:** Services depend on `ILogger` interface, not concrete `ConsoleLogger`.

---

## 📦 Multiple Logger Implementations

```typescript
// Console logger (development)
export class ConsoleLogger implements ILogger { ... }

// File logger (production)
export class FileLogger implements ILogger { ... }

// Datadog logger (production)
export class DatadogLogger implements ILogger { ... }

// Null logger (testing)
export class NullLogger implements ILogger {
  info() {}
  error() {}
  warn() {}
  debug() {}
}
```

**All implement the same interface, all are interchangeable.**

---

## 🎯 Enforced Rules

**Validators will enforce:**
- ❌ No `console.log()` anywhere
- ❌ No `import winston` or other logging libraries
- ✅ Must use `ILogger` interface
- ✅ Must inject via constructor

**But we DON'T enforce singleton - that's your choice in composition root.**

---

## 🚀 Migration from Singleton

If you have code using singleton:

```typescript
// Old (singleton)
import { logger } from '@app/logger';
logger.info('message');

// New (DI)
import type { ILogger } from '@app/logger';

class MyService {
  constructor(private logger: ILogger) {}
  
  doThing() {
    this.logger.info('message');
  }
}
```

---

## 💡 Summary

**Clean Code = Dependency Injection**
- Services declare dependencies in constructor
- Interfaces, not concrete classes
- Composition root wires everything together
- Easy to test, easy to swap, easy to understand
