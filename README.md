# 🏗️ Production-Ready TypeScript Template

**Lead backend developer architecture. All infrastructure ready. Just build YOUR features.**

## What This Is

A complete foundation for **ANY web application**:
- ✅ Graph AI visualization
- ✅ Recipe management
- ✅ Life assistant dashboard
- ✅ NLP text analysis
- ✅ E-commerce platform
- ✅ SaaS product
- ✅ **Whatever you want to build**

All the boring stuff is DONE. You write business logic.

## Quick Start

```bash
# 1. Clone template
git clone <this-repo> my-app
cd my-app

# 2. Install & setup
npm install
cp .env.example .env
npx prisma migrate dev

# 3. Run
npm run dev
```

## What's Already Built

### Frontend (Complete & Ready)
- ✅ **Pagination** (URL-synced)
- ✅ **Search** (debounced)
- ✅ **State management** (Zustand, nuqs, React Hook Form)
- ✅ **UI components** (swappable: Tailwind → Bootstrap → Material-UI)
- ✅ **Auth UI** (NextAuth v5 ready)

### Backend (Enterprise Architecture)
- ✅ **Hexagonal architecture** (Ports & Adapters)
- ✅ **Repository pattern** (database abstraction)
- ✅ **Service layer** (pure business logic)
- ✅ **Dependency injection** (everything testable)
- ✅ **Type-safe everything** (TypeScript strict mode)

### Infrastructure (Plug & Play)
- ✅ **Database** - Prisma (swap to Mongo/Supabase)
- ✅ **API** - tRPC (swap to REST/GraphQL)
- ✅ **Logging** - Console (swap to Winston/Datadog)
- ✅ **Caching** - In-Memory (swap to Redis)
- ✅ **Events** - In-Memory (swap to RabbitMQ/Kafka)
- ✅ **Error messages** - ONE centralized file
- ✅ **Env vars** - Type-safe with Zod

### Third-Party Integrations (Decoupled)
- ✅ **AI/LLM** - OpenAI (swap to Claude/Local)
- ✅ **Email** - Port ready (SendGrid/Postmark/SES)
- ✅ **Payment** - Port ready (Stripe/PayPal/Square)
- ✅ **Storage** - Port ready (S3/R2/Local)
- ✅ **Analytics** - Port ready (Mixpanel/Segment)
- ✅ **Search** - Port ready (Algolia/Meilisearch)

## Building Your App

### 1. Add a Route (Auto-Scaffold)
```bash
nx g feature recipe --fields="title:string,servings:number,ingredients:string[]"
```

**Creates:**
- Domain entity (`core/domain/recipe.entity.ts`)
- Repository port (`core/ports/recipe.repository.port.ts`)
- Service with TODOs (`core/services/recipe.service.ts`)
- Database adapter (`infrastructure/db/prisma-recipe.adapter.ts`)
- tRPC router (`infrastructure/api/recipe.router.ts`)
- Tests (`*.test.ts`)

### 2. Implement Business Logic
```typescript
// core/services/recipe.service.ts
async create(data: CreateRecipeDTO): Promise<Recipe> {
  // TODO: Add your business logic ← YOU FILL THIS
  
  RecipeRules.validateTitle(data.title);
  
  const existing = await this.deps.repository.findMany({ 
    title: data.title 
  });
  
  if (existing.length > 0) {
    throw new Error(ErrorMessages.RECIPE_DUPLICATE_TITLE);
  }
  
  return this.deps.repository.create(data);
}
```

### 3. Add Error Messages (ONE File)
```typescript
// src/lib/error-messages.ts
export const ErrorMessages = {
  RECIPE_NOT_FOUND: 'Recipe not found',
  RECIPE_DUPLICATE_TITLE: 'Recipe already exists',
  RECIPE_INVALID_SERVINGS: 'Servings must be positive',
} as const;
```

### 4. Add Environment Variables
```typescript
// src/lib/env.ts - Just add here
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().optional(),  // ← Add yours
  STRIPE_SECRET: z.string().optional(),    // ← Add yours
});
```

### 5. Add Third-Party Integration
```typescript
// Use existing ports
export class RecipeService {
  constructor(private deps: {
    repository: IRecipeRepository;
    logger: ILogger;
    aiProvider: IAIProvider;  // ← Already defined!
  }) {}
  
  async generateRecipe(ingredients: string[]): Promise<Recipe> {
    const prompt = `Create recipe with: ${ingredients.join(', ')}`;
    const text = await this.deps.aiProvider.generateText(prompt);
    // Parse and save...
  }
}
```

## Swapping Frameworks

### Swap Database (Prisma → MongoDB)
```typescript
// infrastructure/api/recipe.router.ts
- import { PrismaRecipeRepository } from '../db/prisma-recipe.adapter';
+ import { MongoRecipeRepository } from '../db/mongo-recipe.adapter';

- const repo = new PrismaRecipeRepository(db, logger);
+ const repo = new MongoRecipeRepository(mongoClient, logger);

// Service unchanged - works with both!
```

### Swap UI Framework (Tailwind → Bootstrap)
```typescript
// src/app/components/ui/button.tsx
- return <CustomButton {...props} />;
+ return <BootstrapButton {...props} />;

// All app code unchanged!
```

### Swap AI Provider (OpenAI → Claude)
```typescript
- const ai = new OpenAIAdapter(env.OPENAI_API_KEY, logger);
+ const ai = new ClaudeAdapter(env.ANTHROPIC_API_KEY, logger);

// Service unchanged - works with both!
```

## File Structure

```
src/
  app/                    # Frontend (complete)
    components/           # Pagination, Search, UI
    stores/               # Zustand state
    hooks/                # URL state (nuqs)
  
  core/                   # Business logic (framework-free)
    domain/               # Entities, rules
    ports/                # Interfaces (IRepository, ILogger, etc.)
    services/             # Business logic
  
  infrastructure/         # Implementations (swappable)
    db/                   # Prisma, Mongo, InMemory adapters
    integrations/         # OpenAI, Stripe, etc.
    api/                  # tRPC routers
  
  lib/                    # Infrastructure utilities
    db.ts                 # Prisma client
    env.ts                # Env vars
    error-messages.ts     # ALL error messages

tools/generators/         # Nx generators
```

## Architecture

### Hexagonal (Ports & Adapters)
```
Core (business logic)
  ↓ uses
Ports (interfaces)
  ↑ implemented by
Infrastructure (adapters)
```

**Core never depends on frameworks.**
**Frameworks implement core interfaces.**

## Commands

```bash
# Development
npm run dev              # Dev server
npm run build            # Production build

# Quality
npm run lint             # Biome lint
npm run typecheck        # TypeScript check
npm test                 # Run tests
npm run validate         # All checks

# Database
npm run db:migrate       # Run migrations
npm run db:studio        # Prisma Studio

# Scaffolding
nx g feature <name> --fields="..." --adapter=prisma
```

## AI-Proof Enforcement

### What AI CANNOT Do (Blocked)
❌ Create `new PrismaClient()` (pre-commit fails)
❌ Import Prisma in core/ (TypeScript error)
❌ Use `console.log` in services (pre-commit fails)
❌ Import frameworks in domain (TypeScript error)

### What AI CAN Do
✅ Implement business logic in services
✅ Add validation rules
✅ Write tests
✅ Add error messages to ErrorMessages
✅ Copy patterns for new features

## Stack (DECIDED)

**Frontend:**
- React 19 + Next.js 15
- Zustand + nuqs + React Hook Form
- TanStack Query + tRPC
- Tailwind CSS

**Backend:**
- TypeScript strict mode (30+ flags)
- Prisma (swappable)
- tRPC (swappable)
- Zod validation

**Testing:**
- Vitest (unit tests)
- Playwright (E2E tests)
- MSW (API mocking)

**Tooling:**
- Nx (generators)
- Biome (lint + format)
- Husky (pre-commit hooks)

## Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical deep dive
- **[USER_REQUIREMENTS.md](./USER_REQUIREMENTS.md)** - Requirements history

## Example Workflows

### Recipe App
```bash
nx g feature recipe --fields="title:string,ingredients:string[]"
nx g feature ingredient --fields="name:string,amount:string"
# Implement business logic
# Add OpenAI integration for suggestions
# Ship
```

### Graph Visualization
```bash
nx g feature node --fields="label:string,x:number,y:number"
nx g feature edge --fields="source:string,target:string"
# Implement graph algorithms
# Add D3.js visualization
# Ship
```

### NLP Pipeline
```bash
nx g feature document --fields="content:string,embedding:number[]"
# Add OpenAI for embeddings
# Add vector search
# Implement analysis
# Ship
```

---

**Clone. Build. Ship.**
