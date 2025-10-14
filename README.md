# 🚀 Enterprise Template - Fixed Frontend, Swappable Backend

**React scaffold (complete) + Domain logic (per app)**

## 🎯 What This Is

A **production-ready template** you copy for EVERY project:

- ✅ **Frontend complete** - Pagination, search, state management, forms, auth UI
- ✅ **Backend swappable** - Change domain logic, database, business rules per app
- ✅ **AI-proof** - Validators prevent duplicate implementations
- ✅ **Type-safe** - 30+ TypeScript strict flags, no escape hatches

## 🏗️ Architecture

### FIXED (Never Changes)
```
Frontend Scaffold
├── Pagination (URL-synced)
├── Search (debounced)
├── Global state (Zustand)
├── URL state (nuqs)
├── Forms (React Hook Form + Zod)
└── Auth UI (ready for NextAuth)
```

### SWAPPABLE (Changes Per App)
```
Backend Domain
├── Entities (Recipe vs Product vs User)
├── Business logic
├── Database adapter (Prisma vs Mongo vs Supabase)
└── API routes (uses domain services)
```

## 📦 What's Included

### Frontend (Complete, Reusable)

**State Management:**
```typescript
// Global UI state
const { theme, sidebarOpen } = useAppStore();

// Pagination
const { page, limit, nextPage } = usePagination();

// URL state
const [search] = useSearchUrl();
const [{ sortBy, sortOrder }] = useSortUrl(['name', 'date']);
const dialog = useDialogUrl('edit');
```

**Components:**
```tsx
<Pagination total={100} />
<SearchFilter placeholder="Search..." />
```

**Forms:**
```typescript
const form = useForm({
  resolver: zodResolver(schema),
});
```

### Backend (Swappable)

**Domain Layer:**
```typescript
// core/domain/recipe.entity.ts
export interface Recipe {
  id: string;
  title: string;
  // ... your domain model
}
```

**Service Layer:**
```typescript
// core/services/recipe.service.ts
export class RecipeService {
  async search(query: string): Promise<Recipe[]> {
    // Your business logic
  }
}
```

**Adapter Layer:**
```typescript
// Swap database implementation
const repo = new PrismaRecipeRepository(db, logger);
// OR
const repo = new MongoRecipeRepository(mongoClient, logger);
```

## 🚀 Quick Start

```bash
# Install
npm install

# Setup
cp .env.example .env
npx prisma migrate dev

# Run
npm run dev
```

## 📝 Usage

### New Project (RecipeDB)

1. **Copy template**
2. **Define domain:**
   ```typescript
   // core/domain/recipe.entity.ts
   export interface Recipe { ... }
   ```
3. **Implement service:**
   ```typescript
   // core/services/recipe.service.ts
   export class RecipeService { ... }
   ```
4. **Create adapter:**
   ```typescript
   // infrastructure/db/prisma-recipe.adapter.ts
   export class PrismaRecipeRepository implements IRepository<Recipe> { ... }
   ```
5. **Wire API:**
   ```typescript
   // infrastructure/api/trpc.adapter.ts
   export const recipeRouter = router({ ... });
   ```
6. **Frontend already works** - pagination, search, forms ready!

### Change Database (Prisma → MongoDB)

1. Create `mongo-recipe.adapter.ts`
2. Implement `IRepository<Recipe>`
3. Update composition root
4. **Done** - frontend unchanged

## 🛠️ Tech Stack

### Frontend (FIXED)
- **Framework:** Next.js 15 + React 19
- **State:** Zustand (global), React Hook Form (forms), nuqs (URL)
- **Styling:** Tailwind CSS
- **Auth:** NextAuth v5 (UI ready)

### Backend (SWAPPABLE)
- **API:** tRPC (can swap to REST)
- **DB:** Prisma + Postgres (can swap to Mongo, Supabase)
- **Validation:** Zod
- **Testing:** Vitest + Testing Library + Playwright

### Tooling
- Biome (lint + format)
- TypeScript strict mode (30+ flags)
- Husky (pre-commit hooks)
- Custom validators (block bad code)

## 📋 Commands

```bash
# Development
npm run dev              # Next.js dev server
npm run build            # Production build

# Quality
npm run lint             # Biome check
npm run typecheck        # TypeScript
npm run test             # Run tests
npm run validate         # All checks

# Database
npm run db:migrate       # Run migrations
npm run db:studio        # Prisma Studio
```

## 🧪 Testing

### Unit Tests (No Infrastructure)
```typescript
const mockRepo: IRepository = { findById: vi.fn() };
const service = new RecipeService({ repository: mockRepo });
```

### Integration Tests (In-Memory)
```typescript
const repo = new InMemoryRecipeRepository(logger);
const service = new RecipeService({ repository: repo });
```

### E2E Tests (Real DB)
```typescript
const repo = new PrismaRecipeRepository(db, logger);
const service = new RecipeService({ repository: repo });
```

## ✅ Enforcement

### TypeScript Blocks
```typescript
import { PrismaClient } from '@prisma/client'; // ❌ Blocked
import axios from 'axios';                      // ❌ Blocked

import type { IRepository } from '@/core/ports'; // ✅ Correct
```

### Pre-Commit Validators
```
❌ DO NOT create new PrismaClient() in core/
❌ DO NOT import Prisma in core/
❌ DO NOT use console.log in services
✅ Use port interfaces only
```

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Full architecture guide
- **[docs/SWAP_EXAMPLES.md](./docs/SWAP_EXAMPLES.md)** - How to swap frameworks

## 🎯 Examples

**Pagination:**
```tsx
<Pagination total={recipes.total} />
// Automatically syncs to URL: ?page=2&limit=25
```

**Search:**
```tsx
<SearchFilter onSearch={(q) => refetch({ search: q })} />
// Debounced, URL-synced: ?search=chocolate
```

**Sorting:**
```tsx
const [{ sortBy, sortOrder }] = useSortUrl(['name', 'date']);
// URL: ?sortBy=name&sortOrder=asc
```

## 💡 Why This Template

### ✅ DO Once, Use Forever
- Pagination setup ✅
- Search setup ✅
- State management ✅
- Forms setup ✅
- Auth UI ✅

### 🔄 Easy to Change
- Domain logic (Recipe → Product)
- Database (Postgres → Mongo)
- Business rules

### 🚫 Hard to Break
- Validators block bad code
- Types prevent errors
- Tests catch regressions

## 📄 License

MIT

---

**Copy this template. Define your domain. Ship your app.**
