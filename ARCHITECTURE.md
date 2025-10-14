# 🏛️ Hexagonal Architecture (Ports & Adapters)

## Framework Independence

**Change ANY framework, business logic stays untouched.**

```
src/
  core/               ← PURE business logic (no framework deps)
    domain/           ← Entities, value objects, business rules
    ports/            ← Interfaces (IRepository, ILogger, ICache, etc.)
    services/         ← Business logic (uses ONLY ports)
    
  infrastructure/     ← Framework implementations (swappable)
    db/
      prisma.adapter.ts     ← Postgres + Prisma
      mongo.adapter.ts      ← MongoDB (future)
      dynamodb.adapter.ts   ← DynamoDB (future)
    logger/
      console.adapter.ts    ← Console
      winston.adapter.ts    ← Winston (future)
      datadog.adapter.ts    ← Datadog (future)
    cache/
      in-memory.adapter.ts  ← Simple cache
      redis.adapter.ts      ← Redis (future)
    api/
      trpc.adapter.ts       ← tRPC transport
      rest.adapter.ts       ← REST API (future)
      graphql.adapter.ts    ← GraphQL (future)
```

## How to Swap Frameworks

### Swap Database (Prisma → MongoDB)

**Before:**
```typescript
const repository = new PrismaExampleRepository(db, logger);
```

**After:**
```typescript
const repository = new MongoExampleRepository(mongoClient, logger);
```

**Business logic unchanged.** Same `IRepository` interface.

### Swap Logger (Console → Winston)

**Before:**
```typescript
const logger = new ConsoleLogger();
```

**After:**
```typescript
const logger = new WinstonLogger(winstonConfig);
```

**Business logic unchanged.** Same `ILogger` interface.

### Swap API (tRPC → REST)

**Before:**
```typescript
// trpc.adapter.ts
export const exampleRouter = router({ ... });
```

**After:**
```typescript
// rest.adapter.ts
export const exampleRouter = express.Router();
exampleRouter.get('/:id', async (req, res) => {
  const service = createExampleService();
  const result = await service.getById(req.params.id);
  res.json(result);
});
```

**Business logic unchanged.** Same `ExampleService`.

## Dependency Flow

```
Infrastructure → Core (adapters implement ports)
```

```typescript
// ✅ GOOD - Infrastructure depends on Core
import type { IRepository } from '@/core/ports/repository.port';

class PrismaExampleRepository implements IRepository { ... }
```

```typescript
// ❌ BAD - Core depends on Infrastructure
import { PrismaClient } from '@prisma/client'; // BLOCKED!

class ExampleService {
  // Don't do this - couples to Prisma
}
```

## Validators Enforce This

Pre-commit hooks **block** framework imports in `core/`:

```bash
❌ DO NOT import Prisma in core/ 
   → Implement IRepository adapter in infrastructure/

❌ DO NOT import tRPC in core/
   → Use adapters in infrastructure/api/

✅ USE port interfaces only
```

## Testing Benefits

### Pure Unit Tests (No DB, No Framework)

```typescript
// Mock the port interface
const mockRepository: IRepository = {
  findById: vi.fn(),
  create: vi.fn(),
};

const service = new ExampleService({ repository: mockRepository });

// Test business logic in isolation
```

### Integration Tests (Swap to In-Memory)

```typescript
// No Prisma/Postgres needed for tests
const repository = new InMemoryExampleRepository(logger);
const service = new ExampleService({ repository });

// Full integration testing without infrastructure
```

### E2E Tests (Real Adapters)

```typescript
// Use real Prisma adapter
const repository = new PrismaExampleRepository(db, logger);
const service = new ExampleService({ repository });

// Test with real database
```

## Adding New Features

1. **Define Domain Model** (`core/domain/`)
   ```typescript
   export interface Recipe { ... }
   export class RecipeRules { ... }
   ```

2. **Create Service** (`core/services/`)
   ```typescript
   export class RecipeService {
     constructor(private deps: { repository: IRepository<Recipe> }) {}
   }
   ```

3. **Implement Adapter** (`infrastructure/db/`)
   ```typescript
   export class PrismaRecipeRepository implements IRepository<Recipe> { ... }
   ```

4. **Wire in Router** (`infrastructure/api/`)
   ```typescript
   export const recipeRouter = router({
     getById: procedure.query(async ({ input }) => {
       const service = createRecipeService();
       return service.getById(input);
     }),
   });
   ```

## Core Principles

### ✅ DO
- Define interfaces (ports) in `core/ports/`
- Implement business logic using ONLY ports
- Create adapters in `infrastructure/`
- Inject dependencies via constructor
- Test business logic with mocks

### ❌ DON'T
- Import framework code in `core/`
- Create new adapters in `core/`
- Use singletons (use DI instead)
- Couple business logic to infrastructure

## Migration Guide

### To swap from Prisma to MongoDB:

1. Create `infrastructure/db/mongo.adapter.ts`
2. Implement `IRepository<Example, ...>`
3. Update composition root:
   ```typescript
   const repository = new MongoExampleRepository(mongoClient, logger);
   ```
4. **Done.** No other changes needed.

### To swap from tRPC to GraphQL:

1. Create `infrastructure/api/graphql.adapter.ts`
2. Use same `ExampleService`
3. Map GraphQL resolvers to service methods
4. **Done.** Business logic untouched.

## File Count

**Core (framework-free):**
- `core/domain/example.entity.ts`
- `core/ports/*.port.ts` (5 files)
- `core/services/example.service.ts`

**Infrastructure (swappable):**
- `infrastructure/db/*.adapter.ts`
- `infrastructure/logger/*.adapter.ts`
- `infrastructure/cache/*.adapter.ts`
- `infrastructure/api/*.adapter.ts`

**Total:** ~15 files for complete feature with swappable everything.

---

**This is what Google-level architecture looks like.**
