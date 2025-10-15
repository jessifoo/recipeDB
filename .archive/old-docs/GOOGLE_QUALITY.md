# 🏆 Google-Level Quality Standards

## Architecture Patterns

### 1. Hexagonal Architecture (Ports & Adapters)

**Core Principle:** Business logic is 100% framework-independent.

```typescript
// ✅ CORRECT - Service depends on PORT (interface)
import type { IRecipeRepository } from '../ports/recipe.repository.port';

export class RecipeService {
  constructor(private repository: IRecipeRepository) {}
  // Works with ANY database
}

// ❌ WRONG - Service depends on ADAPTER (implementation)
import { PrismaRecipeRepository } from '../db/prisma-recipe.adapter';

export class RecipeService {
  constructor(private repository: PrismaRecipeRepository) {}
  // Coupled to Prisma
}
```

### 2. Dependency Injection

**All dependencies injected via constructor.**

```typescript
// ✅ CORRECT - Testable, swappable
export class RecipeService {
  constructor(private deps: {
    repository: IRecipeRepository;
    logger: ILogger;
    cache?: ICache;
  }) {}
}

// Test with mocks
const mockRepo: IRecipeRepository = { findById: vi.fn() };
const service = new RecipeService({ repository: mockRepo, logger: mockLogger });

// ❌ WRONG - Hard-coded dependencies
export class RecipeService {
  private repository = new PrismaRecipeRepository();
  private logger = console;
  // Cannot test, cannot swap
}
```

### 3. Interface Segregation

**Ports define ONLY what's needed.**

```typescript
// ✅ CORRECT - Minimal, focused interface
export interface IRecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  findMany(filter?: RecipeFilter): Promise<Recipe[]>;
  create(data: CreateRecipeDTO): Promise<Recipe>;
  update(id: string, data: UpdateRecipeDTO): Promise<Recipe>;
  delete(id: string): Promise<void>;
}

// ❌ WRONG - God interface
export interface IRecipeRepository {
  findById(id: string): Promise<Recipe | null>;
  findBySlug(slug: string): Promise<Recipe | null>;
  findByAuthor(authorId: string): Promise<Recipe[]>;
  findByTags(tags: string[]): Promise<Recipe[]>;
  // 50+ methods...
  // Use findMany with filters instead
}
```

### 4. Single Responsibility

**Each layer has ONE job.**

```typescript
// ✅ CORRECT - Thin router, delegates to service
export const recipeRouter = router({
  create: publicProcedure
    .input(createRecipeSchema)
    .mutation(async ({ input, ctx }) => {
      const service = createRecipeService(ctx);
      return service.create(input); // Service does the work
    }),
});

// ❌ WRONG - Router has business logic
export const recipeRouter = router({
  create: publicProcedure
    .input(createRecipeSchema)
    .mutation(async ({ input, ctx }) => {
      // Validation
      if (input.title.length < 3) throw new Error('Too short');
      
      // Business logic
      const existing = await ctx.db.recipe.findFirst({ 
        where: { title: input.title } 
      });
      if (existing) throw new Error('Duplicate');
      
      // Database call
      return ctx.db.recipe.create({ data: input });
      
      // All this belongs in the SERVICE
    }),
});
```

## Database Adapter Quality

### Multiple Implementations of Same Port

**Any database can implement `IRecipeRepository`:**

#### Prisma (SQL)
```typescript
export class PrismaRecipeRepository implements IRecipeRepository {
  async findById(id: string): Promise<Recipe | null> {
    return this.db.recipe.findUnique({ where: { id } });
  }
}
```

#### MongoDB
```typescript
export class MongoRecipeRepository implements IRecipeRepository {
  async findById(id: string): Promise<Recipe | null> {
    const doc = await this.collection.findOne({ _id: id });
    return doc ? this.mapToEntity(doc) : null;
  }
}
```

#### DynamoDB
```typescript
export class DynamoRecipeRepository implements IRecipeRepository {
  async findById(id: string): Promise<Recipe | null> {
    const result = await this.client.get({
      TableName: 'recipes',
      Key: { id },
    });
    return result.Item ? this.mapToEntity(result.Item) : null;
  }
}
```

#### In-Memory (Testing)
```typescript
export class InMemoryRecipeRepository implements IRecipeRepository {
  private data = new Map<string, Recipe>();
  
  async findById(id: string): Promise<Recipe | null> {
    return this.data.get(id) || null;
  }
}
```

**Service doesn't care which one you use.**

## Swapping Adapters

### Easy Swap (Composition Root)

```typescript
// infrastructure/api/recipe.router.ts

// Swap 1: Use Prisma
import { PrismaRecipeRepository } from '../db/prisma-recipe.adapter';
const repository = new PrismaRecipeRepository(db, logger);

// Swap 2: Use MongoDB
import { MongoRecipeRepository } from '../db/mongo-recipe.adapter';
const repository = new MongoRecipeRepository(mongoClient, logger);

// Swap 3: Use In-Memory (testing)
import { InMemoryRecipeRepository } from '../db/inmemory-recipe.adapter';
const repository = new InMemoryRecipeRepository(logger);

// Service works with ALL of them
const service = new RecipeService({ repository, logger });
```

### Environment-Based Swapping

```typescript
function createRecipeRepository(logger: ILogger): IRecipeRepository {
  if (process.env.DATABASE_TYPE === 'mongodb') {
    return new MongoRecipeRepository(mongoClient, logger);
  }
  
  if (process.env.DATABASE_TYPE === 'dynamodb') {
    return new DynamoRecipeRepository(dynamoClient, logger);
  }
  
  // Default: Prisma
  return new PrismaRecipeRepository(db, logger);
}

const service = new RecipeService({
  repository: createRecipeRepository(logger),
  logger,
});
```

## Error Handling

### Domain Errors vs Infrastructure Errors

```typescript
// ✅ CORRECT - Translate at boundaries

// Domain layer (business errors)
export class RecipeService {
  async create(data: CreateRecipeDTO): Promise<Recipe> {
    // Business rule
    if (data.servings < 1) {
      throw new Error('Servings must be at least 1'); // Domain error
    }
    
    try {
      return await this.repository.create(data);
    } catch (error) {
      this.logger.error('Failed to create recipe', { error });
      throw new Error('Failed to create recipe'); // Generic for caller
    }
  }
}

// API layer (transport errors)
export const recipeRouter = router({
  create: publicProcedure
    .mutation(async ({ input, ctx }) => {
      try {
        return await service.create(input);
      } catch (error) {
        if (error.message.includes('Servings')) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: error.message });
        }
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }
    }),
});
```

## Testing Standards

### Unit Tests (Pure Business Logic)

```typescript
describe('RecipeService', () => {
  it('should validate servings', async () => {
    const mockRepo: IRecipeRepository = {
      create: vi.fn(),
      // ... other methods
    };
    
    const service = new RecipeService({ 
      repository: mockRepo, 
      logger: mockLogger 
    });
    
    await expect(service.create({ 
      title: 'Test',
      servings: 0  // Invalid
    })).rejects.toThrow('Servings must be at least 1');
    
    expect(mockRepo.create).not.toHaveBeenCalled(); // Validation prevented DB call
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
    
    const created = await caller.recipe.create({
      title: 'Pizza',
      servings: 8,
    });
    
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Pizza');
  });
});
```

## Type Safety

### Branded Types for IDs

```typescript
// Prevent ID mixing
type RecipeId = string & { readonly __brand: 'RecipeId' };
type UserId = string & { readonly __brand: 'UserId' };

function getRecipe(id: RecipeId): Promise<Recipe> { ... }

const recipeId = '123' as RecipeId;
const userId = '456' as UserId;

getRecipe(recipeId);  // ✅ OK
getRecipe(userId);    // ❌ Type error
```

### Strict null checks

```typescript
// All TypeScript strict flags enabled
async findById(id: string): Promise<Recipe | null> {
  const recipe = await this.repository.findById(id);
  
  // Must check for null
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  
  return recipe; // TypeScript knows it's not null here
}
```

## Performance

### Caching Pattern

```typescript
export class RecipeService {
  async getById(id: string): Promise<Recipe> {
    // Try cache first
    const cached = await this.cache?.get<Recipe>(`recipe:${id}`);
    if (cached) return cached;
    
    // Fetch from DB
    const recipe = await this.repository.findById(id);
    if (!recipe) throw new Error('Not found');
    
    // Cache for future
    await this.cache?.set(`recipe:${id}`, recipe, 300);
    
    return recipe;
  }
}
```

### Pagination

```typescript
async list(filter: RecipeFilter, pagination: { page: number; limit: number }) {
  const offset = (pagination.page - 1) * pagination.limit;
  
  const [items, total] = await Promise.all([
    this.repository.findMany(filter, { offset, limit: pagination.limit }),
    this.repository.count(filter),
  ]);
  
  return {
    items,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
}
```

## Documentation Standards

### Interface Documentation

```typescript
/**
 * Recipe Repository - Data access abstraction
 * 
 * Implementations:
 * - PrismaRecipeRepository (PostgreSQL)
 * - MongoRecipeRepository (MongoDB)
 * - InMemoryRecipeRepository (Testing)
 * 
 * @example
 * const repo = new PrismaRecipeRepository(db, logger);
 * const recipe = await repo.findById('123');
 */
export interface IRecipeRepository {
  /**
   * Find recipe by ID
   * @param id - Recipe ID
   * @returns Recipe or null if not found
   */
  findById(id: string): Promise<Recipe | null>;
}
```

---

**This is Google-level: Testable, swappable, maintainable, scalable.**
