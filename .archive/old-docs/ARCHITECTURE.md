# 🏛️ Template Architecture

## Core Concept: Fixed Frontend, Swappable Backend

### What NEVER Changes (Copy for Every Project)

```
src/app/                    ← FIXED FRONTEND SCAFFOLD
  stores/
    use-app.store.ts        ← Global UI state (sidebar, theme, etc.)
    use-pagination.store.ts ← Reusable pagination
  hooks/
    use-url-state.ts        ← URL state management (nuqs)
  components/
    pagination.tsx          ← Pagination UI
    search-filter.tsx       ← Search with debounce
  
  → React, Next.js, Zustand, React Hook Form, nuqs
  → Too integrated to swap - optimized, ready to go
```

### What Changes Per App (Swappable Domain Logic)

```
src/core/                   ← SWAPPABLE BUSINESS LOGIC
  domain/
    recipe.entity.ts        ← OR product.entity.ts OR user.entity.ts
    recipe.rules.ts         ← Business rules per app
  services/
    recipe.service.ts       ← Business logic per app
  ports/
    repository.port.ts      ← Stays same (interface)
    logger.port.ts          ← Stays same (interface)

src/infrastructure/         ← SWAPPABLE DATABASE/TECH
  db/
    prisma.adapter.ts       ← OR mongo.adapter.ts OR supabase.adapter.ts
```

---

## Example: Building RecipeDB vs E-Commerce

### RecipeDB
```typescript
// core/domain/recipe.entity.ts
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
}

// core/services/recipe.service.ts
export class RecipeService {
  async search(query: string): Promise<Recipe[]> {
    // Recipe-specific logic
  }
}
```

### E-Commerce (Same Template, Different Domain)
```typescript
// core/domain/product.entity.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// core/services/product.service.ts
export class ProductService {
  async purchase(id: string): Promise<Order> {
    // E-commerce-specific logic
  }
}
```

**Frontend stays IDENTICAL:**
- Pagination component
- Search component
- URL state management
- Global state (Zustand)
- Forms (React Hook Form)

---

## Frontend Scaffold (REUSABLE)

### Global State Management

**App Store** - Every app needs this:
```typescript
const { theme, sidebarOpen, toggleSidebar } = useAppStore();
```

**Pagination Store** - Create per entity:
```typescript
const useRecipePagination = createPaginationStore('recipes');
const { page, limit, nextPage, prevPage } = useRecipePagination();
```

### URL State (nuqs)

**Built-in hooks for common patterns:**
```typescript
// Pagination
const [{ page, limit }, setParams] = usePaginationUrl();

// Search
const [search, setSearch] = useSearchUrl();

// Sorting
const [{ sortBy, sortOrder }] = useSortUrl(['createdAt', 'name']);

// Tabs
const [tab, setTab] = useTabUrl(['all', 'active', 'archived'], 'all');

// Modals
const dialog = useDialogUrl('edit');
dialog.open('recipe-123');
dialog.close();
```

### Forms (React Hook Form + Zod)

**Pattern for every form:**
```typescript
const form = useForm({
  resolver: zodResolver(createRecipeSchema),
  defaultValues: { title: '', ingredients: [] },
});

const onSubmit = form.handleSubmit(async (data) => {
  await createMutation.mutateAsync(data);
});
```

### Components

**Pagination** - Drop in anywhere:
```tsx
<Pagination 
  total={data.total} 
  onPageChange={(page) => refetch({ page })} 
/>
```

**Search** - Debounced, URL-synced:
```tsx
<SearchFilter 
  placeholder="Search recipes..." 
  onSearch={(q) => refetch({ search: q })} 
/>
```

---

## Backend Flexibility (SWAPPABLE)

### Domain Layer

**Changes per app:**
- Entities (Recipe vs Product vs User)
- Business rules
- Validation logic
- Services

**Same pattern:**
- Always use port interfaces
- Always dependency injection
- Always testable

### Infrastructure Layer

**Swap database:**
```typescript
// Postgres + Prisma
const repo = new PrismaRecipeRepository(db, logger);

// MongoDB
const repo = new MongoRecipeRepository(mongoClient, logger);

// Supabase
const repo = new SupabaseRecipeRepository(supabase, logger);
```

**Swap API transport (less common, but possible):**
```typescript
// tRPC (default)
export const recipeRouter = router({ ... });

// REST (if needed)
export const recipeRouter = express.Router();
recipeRouter.get('/', ...);
```

---

## File Organization

### FIXED (Copy Every Time)
```
src/app/
  layout.tsx              ← Root layout
  page.tsx                ← Home page
  stores/                 ← Global state (3 files)
  hooks/                  ← URL state hooks (1 file)
  components/             ← Reusable UI (5-10 files)
  providers.tsx           ← React Query, etc.
```

### CHANGES PER APP
```
src/core/
  domain/
    [entity].entity.ts    ← Your domain model
  services/
    [entity].service.ts   ← Your business logic
  ports/                  ← Same interfaces, reused

src/infrastructure/
  db/
    [adapter].adapter.ts  ← Database implementation
  api/
    trpc.adapter.ts       ← API routes (uses your service)
```

### Total Files
- **Frontend (fixed):** ~15 files
- **Backend (per app):** ~10 files per feature
- **Total:** ~25 files for complete CRUD app

---

## What This Solves

### ✅ Every Project Gets
1. **Pagination** - Working, URL-synced, tested
2. **Search** - Debounced, URL-synced, accessible
3. **Global state** - Theme, sidebar, preferences
4. **URL state** - Filters, tabs, modals in URL
5. **Forms** - Type-safe, validated, error handling
6. **Auth UI** - Login, signup, forgot password

### 🔄 Easy to Change
1. **Domain logic** - Recipe → Product → User
2. **Database** - Postgres → MongoDB → Supabase
3. **Schema** - Just update Prisma schema
4. **Business rules** - All in service layer

### 🚫 Hard to Mess Up
- Frontend patterns = copy/paste
- Validators block bad imports
- Types prevent runtime errors
- Tests catch regressions

---

## Usage Pattern

### Starting a New Project

1. **Copy template** (frontend scaffold already complete)
2. **Define domain** (`core/domain/recipe.entity.ts`)
3. **Implement service** (`core/services/recipe.service.ts`)
4. **Choose database** (`infrastructure/db/prisma-recipe.adapter.ts`)
5. **Wire API** (`infrastructure/api/trpc.adapter.ts`)
6. **Use frontend** (already done - just call tRPC)

### Migrating to New DB

1. Create new adapter (`mongo-recipe.adapter.ts`)
2. Implement `IRepository` interface
3. Update composition root
4. **Done** - no other changes

### Adding a Feature

1. Update domain model
2. Add service methods
3. Update repository
4. Add tRPC endpoints
5. **Frontend just works** (pagination, search, etc.)

---

**This is the template: React scaffold (fixed) + Domain logic (swappable)**
