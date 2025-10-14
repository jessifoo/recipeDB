# 🎯 AI-Proof TypeScript Template

**Google-level architecture. Zero decisions. Everything generated.**

## 🏗️ Clean Architecture

```
✅ FRONTEND (Fixed)     - Pagination, search, state management
✅ DOMAIN (Swappable)   - Your business logic per app
✅ ADAPTERS (Swappable) - Prisma, Mongo, or In-Memory
✅ GENERATOR (Nx)       - Creates everything from one command
```

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Setup Database
```bash
cp .env.example .env
npx prisma migrate dev
```

### 3. Generate Feature
```bash
# Generate complete CRUD feature
nx g feature recipe --fields="title:string,servings:number,ingredients:string[]"

# Choose database adapter
nx g feature product --fields="name:string,price:number" --adapter=prisma
nx g feature user --fields="email:string,name:string" --adapter=mongo
nx g feature test --fields="data:string" --adapter=inmemory  # For testing
nx g feature all --fields="title:string" --adapter=all  # Generate all adapters
```

**Creates:**
- ✅ Domain entity (`core/domain/recipe.entity.ts`)
- ✅ Repository port (`core/ports/recipe.repository.port.ts`)
- ✅ Service with business logic (`core/services/recipe.service.ts`)
- ✅ Database adapter (`infrastructure/db/prisma-recipe.adapter.ts`)
- ✅ tRPC router (`infrastructure/api/recipe.router.ts`)
- ✅ Unit tests (`core/services/recipe.service.test.ts`)
- ✅ Updates Prisma schema

### 4. Wire Router
```typescript
// src/server/api/root.ts
import { recipeRouter } from '@/infrastructure/api/recipe.router';

export const appRouter = router({
  recipe: recipeRouter,  // Add this
});
```

### 5. Run Migration
```bash
npx prisma migrate dev --name add-recipe
```

### 6. Implement Business Logic
```typescript
// core/services/recipe.service.ts
async create(data: CreateRecipeDTO): Promise<Recipe> {
  // TODO: Add your business logic here ⬅️ AI fills this
  RecipeRules.validateTitle(data.title);
  
  return await this.deps.repository.create(data);
}
```

### 7. Test & Run
```bash
npm test          # Run tests
npm run dev       # Start dev server
```

## 📁 File Structure

```
src/
  app/              # Frontend (Fixed - works for every app)
    components/     # Pagination, SearchFilter
    stores/         # Zustand state management
    hooks/          # URL state (nuqs)
  
  core/             # Domain (Changes per app)
    domain/         # Entities, business rules
    ports/          # Interfaces (IRepository, ILogger, etc.)
    services/       # Business logic (framework-free)
  
  infrastructure/   # Adapters (Swappable)
    db/             # Prisma, Mongo, InMemory implementations
    logger/         # Console, Winston, etc.
    api/            # tRPC routers

tools/generators/   # Nx generators (creates features)
```

## 🔄 Swap Database

**Easy swap in router:**
```typescript
// infrastructure/api/recipe.router.ts

// Use Prisma
import { PrismaRecipeRepository } from '../db/prisma-recipe.adapter';
const repo = new PrismaRecipeRepository(db, logger);

// Swap to MongoDB
import { MongoRecipeRepository } from '../db/mongo-recipe.adapter';
const repo = new MongoRecipeRepository(mongoClient, logger);

// Swap to In-Memory (testing)
import { InMemoryRecipeRepository } from '../db/inmemory-recipe.adapter';
const repo = new InMemoryRecipeRepository(logger);

// Service works with ALL adapters
const service = new RecipeService({ repository: repo, logger });
```

## 🧪 Testing

### Unit Tests (Mocked Dependencies)
```typescript
const mockRepo: IRecipeRepository = { findById: vi.fn() };
const service = new RecipeService({ repository: mockRepo, logger });

await expect(service.create({ servings: 0 })).rejects.toThrow();
```

### Integration Tests (In-Memory Adapter)
```typescript
const repo = new InMemoryRecipeRepository(logger);
const service = new RecipeService({ repository: repo, logger });

const created = await service.create({ title: 'Test', servings: 4 });
expect(created.id).toBeDefined();
```

## 🎨 Frontend (Already Built)

### Pagination
```tsx
<Pagination total={100} />
// Auto-syncs to URL: ?page=2&limit=25
```

### Search
```tsx
<SearchFilter placeholder="Search recipes..." />
// Debounced, URL-synced: ?search=pasta
```

### State Management
```typescript
// Global UI state (Zustand)
const { theme, sidebarOpen } = useAppStore();

// URL state (nuqs)
const [search] = useSearchUrl();
const [{ page, limit }] = usePaginationUrl();
const [{ sortBy, sortOrder }] = useSortUrl(['name', 'date']);
```

## 🛡️ AI-Proof Enforcement

### TypeScript Blocks
```typescript
import { PrismaClient } from '@prisma/client'; // ❌ Compile error
import axios from 'axios';                      // ❌ Blocked

import type { IRepository } from '@/core/ports'; // ✅ Correct
```

### Pre-Commit Validators
```
❌ DO NOT create new PrismaClient() in core/
❌ DO NOT import Prisma in services
❌ DO NOT use console.log in business logic
✅ Use port interfaces only
```

## 📚 Documentation

- **[CURRENT_STATE.md](./CURRENT_STATE.md)** - Current clean architecture
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture guide
- **[docs/GENERATOR_GUIDE.md](./docs/GENERATOR_GUIDE.md)** - Generator usage
- **[docs/GOOGLE_QUALITY.md](./docs/GOOGLE_QUALITY.md)** - Quality standards
- **[docs/SWAP_EXAMPLES.md](./docs/SWAP_EXAMPLES.md)** - How to swap databases

## 🎯 What AI Can Do

✅ Implement business logic in services
✅ Add validation rules in `EntityRules`
✅ Fill generator `TODO` sections
✅ Write tests

## 🚫 What AI Cannot Do

❌ Create duplicate implementations (validators block)
❌ Import frameworks in core layer (compile error)
❌ Use wrong patterns (generator enforces structure)

## 📋 Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Quality
npm run lint             # Biome check
npm run typecheck        # TypeScript validation
npm test                 # Run all tests
npm run validate         # All checks

# Database
npm run db:migrate       # Prisma migrate
npm run db:studio        # Prisma Studio

# Generators
nx g feature <name> --fields="..." --adapter=prisma
```

## 🏆 Stack

**Frontend (Fixed):**
- Next.js 15 + React 19
- Zustand + nuqs + React Hook Form
- TanStack Query + tRPC

**Backend (Swappable):**
- TypeScript strict mode (30+ flags)
- Prisma / MongoDB / In-Memory
- tRPC / REST (swappable)
- Zod validation

**Tooling:**
- Nx generators
- Biome (lint + format)
- Vitest + Playwright
- Custom validators

## 📄 License

MIT

---

**ONE command. EVERYTHING generated. AI just fills business logic.**
