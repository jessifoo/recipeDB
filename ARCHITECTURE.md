# 🏛️ Architecture Deep Dive

## Hexagonal Architecture (Ports & Adapters)

**Goal:** Business logic is 100% framework-independent.

```
┌─────────────────────────────────────────┐
│           Application Core              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Domain Layer                  │   │
│  │   - Entities                    │   │
│  │   - Business Rules              │   │
│  │   - Value Objects               │   │
│  └─────────────────────────────────┘   │
│                 ↓                       │
│  ┌─────────────────────────────────┐   │
│  │   Ports (Interfaces)            │   │
│  │   - IRepository                 │   │
│  │   - ILogger                     │   │
│  │   - IAIProvider                 │   │
│  │   - IEmailProvider              │   │
│  └─────────────────────────────────┘   │
│                 ↓                       │
│  ┌─────────────────────────────────┐   │
│  │   Services (Business Logic)     │   │
│  │   - Uses ONLY port interfaces   │   │
│  │   - Framework-free              │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                 ↑
                 │ implements
                 │
┌─────────────────────────────────────────┐
│        Infrastructure Layer             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Adapters                      │   │
│  │   - PrismaRepository            │   │
│  │   - MongoRepository             │   │
│  │   - ConsoleLogger               │   │
│  │   - OpenAIAdapter               │   │
│  │   - StripeAdapter               │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   API Layer                     │   │
│  │   - tRPC routers                │   │
│  │   - Wire services to endpoints  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Core Principles

### 1. Dependency Inversion
**Infrastructure depends on Core, NOT the other way around.**

```typescript
// ✅ CORRECT - Service depends on interface
import type { IRepository } from '@/core/ports/repository.port';

export class RecipeService {
  constructor(private repo: IRepository<Recipe>) {}
}

// ❌ WRONG - Service depends on implementation
import { PrismaRecipeRepository } from '@/infrastructure/db/prisma';

export class RecipeService {
  constructor(private repo: PrismaRecipeRepository) {}
}
```

### 2. Interface Segregation
**Ports define ONLY what's needed.**

```typescript
// ✅ CORRECT - Minimal, focused
export interface IRecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  findMany(filter?: RecipeFilter): Promise<Recipe[]>;
  create(data: CreateRecipeDTO): Promise<Recipe>;
  update(id: string, data: UpdateRecipeDTO): Promise<Recipe>;
  delete(id: string): Promise<void>;
}

// ❌ WRONG - God interface with 50+ methods
```

### 3. Single Responsibility
**Each layer has ONE job.**

```typescript
// Router: Validate & delegate
export const recipeRouter = router({
  create: procedure
    .input(createRecipeSchema)
    .mutation(({ input }) => {
      const service = createRecipeService();
      return service.create(input); // ← Service does the work
    }),
});

// Service: Business logic
export class RecipeService {
  async create(data: CreateRecipeDTO): Promise<Recipe> {
    RecipeRules.validate(data); // ← Business rules
    return this.repo.create(data);
  }
}

// Repository: Data access
export class PrismaRecipeRepository {
  async create(data: CreateRecipeDTO): Promise<Recipe> {
    return this.db.recipe.create({ data }); // ← Just DB calls
  }
}
```

## Layer Responsibilities

### Core Layer (Framework-Free)

**Domain (`core/domain/`):**
- Pure TypeScript entities
- Business rules
- Value objects
- NO framework imports

```typescript
// core/domain/recipe.entity.ts
export interface Recipe {
  id: string;
  title: string;
  servings: number;
}

export class RecipeRules {
  static validateServings(servings: number): void {
    if (servings < 1) {
      throw new Error('Servings must be positive');
    }
  }
}
```

**Ports (`core/ports/`):**
- Interface definitions
- Contracts for infrastructure
- NO implementations

```typescript
// core/ports/recipe.repository.port.ts
export interface IRecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  // ... other methods
}
```

**Services (`core/services/`):**
- Business logic
- Uses ONLY port interfaces
- Fully testable with mocks

```typescript
// core/services/recipe.service.ts
export class RecipeService {
  constructor(private deps: {
    repository: IRecipeRepository;
    logger: ILogger;
    aiProvider: IAIProvider;
  }) {}
  
  async create(data: CreateRecipeDTO): Promise<Recipe> {
    // Business logic here
    RecipeRules.validate(data);
    return this.deps.repository.create(data);
  }
}
```

### Infrastructure Layer (Swappable)

**Adapters (`infrastructure/db/`, `infrastructure/integrations/`):**
- Implement port interfaces
- Framework-specific code
- Swappable implementations

```typescript
// infrastructure/db/prisma-recipe.adapter.ts
export class PrismaRecipeRepository implements IRecipeRepository {
  constructor(private db: PrismaClient, private logger: ILogger) {}
  
  async findById(id: string): Promise<Recipe | null> {
    return this.db.recipe.findUnique({ where: { id } });
  }
}

// infrastructure/db/mongo-recipe.adapter.ts
export class MongoRecipeRepository implements IRecipeRepository {
  constructor(private client: MongoClient, private logger: ILogger) {}
  
  async findById(id: string): Promise<Recipe | null> {
    return this.client.db().collection('recipes').findOne({ _id: id });
  }
}
```

**API Layer (`infrastructure/api/`):**
- Wire services to transport (tRPC, REST, GraphQL)
- Composition root (dependency injection)
- Error translation

```typescript
// infrastructure/api/recipe.router.ts
export const recipeRouter = router({
  create: procedure
    .input(createRecipeSchema)
    .mutation(async ({ input, ctx }) => {
      // Composition root - wire dependencies
      const service = new RecipeService({
        repository: new PrismaRecipeRepository(ctx.db, ctx.logger),
        logger: ctx.logger,
        aiProvider: new OpenAIAdapter(env.OPENAI_API_KEY, ctx.logger),
      });
      
      try {
        return await service.create(input);
      } catch (error) {
        throw toTRPCError(error); // ← Translate to transport error
      }
    }),
});
```

## Swapping Implementations

### Database Swap Example

**From Prisma to MongoDB:**

```typescript
// infrastructure/api/recipe.router.ts

// Before (Prisma)
const repository = new PrismaRecipeRepository(db, logger);

// After (MongoDB)
const repository = new MongoRecipeRepository(mongoClient, logger);

// Service unchanged - works with both!
const service = new RecipeService({ repository, logger });
```

**Both implement the same interface:**
```typescript
interface IRecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  // ...
}
```

### Third-Party Service Swap

**From OpenAI to Claude:**

```typescript
// Before
const aiProvider = new OpenAIAdapter(env.OPENAI_API_KEY, logger);

// After
const aiProvider = new ClaudeAdapter(env.ANTHROPIC_API_KEY, logger);

// Service unchanged!
const service = new RecipeService({ repository, logger, aiProvider });
```

## Testing Strategy

### Unit Tests (Pure Logic)
```typescript
describe('RecipeService', () => {
  it('should validate servings', async () => {
    // Mock all dependencies
    const mockRepo: IRecipeRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      // ...
    };
    
    const service = new RecipeService({
      repository: mockRepo,
      logger: mockLogger,
    });
    
    await expect(service.create({ servings: 0 }))
      .rejects.toThrow('Servings must be positive');
    
    // Verify business logic without database
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
```

### Integration Tests (Real Adapters)
```typescript
describe('RecipeService with InMemory adapter', () => {
  let repository: InMemoryRecipeRepository;
  let service: RecipeService;
  
  beforeEach(() => {
    repository = new InMemoryRecipeRepository(logger);
    service = new RecipeService({ repository, logger });
  });
  
  it('should create and retrieve recipe', async () => {
    const created = await service.create({
      title: 'Pasta',
      servings: 4,
    });
    
    const retrieved = await service.getById(created.id);
    expect(retrieved).toEqual(created);
  });
});
```

### E2E Tests (Full Stack)
```typescript
describe('Recipe API', () => {
  it('should create recipe via tRPC', async () => {
    const caller = appRouter.createCaller({ db, logger });
    
    const recipe = await caller.recipe.create({
      title: 'Pizza',
      servings: 8,
    });
    
    expect(recipe.id).toBeDefined();
  });
});
```

## Error Handling

### Domain Errors (Business Logic)
```typescript
// core/services/recipe.service.ts
if (servings < 1) {
  throw new Error(ErrorMessages.INVALID_SERVINGS);
}
```

### Transport Errors (API Layer)
```typescript
// infrastructure/api/recipe.router.ts
try {
  return await service.create(input);
} catch (error) {
  if (error.message === ErrorMessages.INVALID_SERVINGS) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
  }
  throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
}
```

## Folder Structure Rationale

```
src/
  core/                     # Pure business logic
    domain/                 # What your app is about
      recipe.entity.ts      # Recipe domain model
    ports/                  # Contracts for infrastructure
      recipe.repository.port.ts
    services/               # How your app works
      recipe.service.ts
  
  infrastructure/           # How to implement contracts
    db/                     # Database adapters
      prisma-recipe.adapter.ts
      mongo-recipe.adapter.ts
    integrations/           # Third-party adapters
      openai.adapter.ts
      stripe.adapter.ts
    api/                    # API adapters
      recipe.router.ts      # tRPC router
  
  app/                      # Frontend (Next.js)
    components/             # UI components
    stores/                 # State management
```

## Key Benefits

1. **Testability** - Mock interfaces, test business logic in isolation
2. **Flexibility** - Swap databases, APIs, integrations easily
3. **Maintainability** - Clear separation of concerns
4. **Scalability** - Add features without touching core
5. **AI-Proof** - Validators enforce architectural boundaries

## Anti-Patterns to Avoid

### ❌ Service Depending on Implementation
```typescript
import { PrismaRecipeRepository } from '@/infrastructure/db/prisma';

export class RecipeService {
  constructor(private repo: PrismaRecipeRepository) {} // ← BAD
}
```

### ❌ Core Importing Framework
```typescript
import { PrismaClient } from '@prisma/client'; // ← BLOCKED

export class RecipeService {
  // Core should never import Prisma
}
```

### ❌ Business Logic in Router
```typescript
export const recipeRouter = router({
  create: procedure.mutation(async ({ input, ctx }) => {
    // ❌ Validation here
    if (input.servings < 1) throw new Error('Bad servings');
    
    // ❌ Business logic here
    const existing = await ctx.db.recipe.findFirst({ ... });
    
    // ❌ DB call here
    return ctx.db.recipe.create({ data: input });
  }),
});
```

### ✅ Correct Pattern
```typescript
export const recipeRouter = router({
  create: procedure.mutation(async ({ input, ctx }) => {
    const service = createRecipeService(ctx);
    return service.create(input); // ← Delegate everything
  }),
});
```

---

**This architecture ensures your app can evolve without breaking.**
