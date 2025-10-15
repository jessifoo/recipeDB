# 🎯 Template Usage Guide

## What This Template Is

**A production-ready foundation for ANY web app with lead backend developer architecture.**

All the boring infrastructure is DONE. You just build YOUR features.

## Use Cases

✅ Graph AI visualization app
✅ Recipe management system
✅ Personal life assistant dashboard
✅ Text history NLP analysis pipeline
✅ E-commerce platform
✅ Social media clone
✅ SaaS product
✅ **ANY web application**

## What's Already Built

### Frontend (Complete)
- ✅ **Pagination** - Working, URL-synced, reusable
- ✅ **Search** - Debounced, URL-synced
- ✅ **State Management** - Zustand (global), nuqs (URL), React Hook Form (forms)
- ✅ **Auth UI** - NextAuth v5 ready to configure
- ✅ **UI Components** - Swappable (ShadCN → Bootstrap → Material-UI)

### Backend (Enterprise Architecture)
- ✅ **Hexagonal Architecture** - Ports & Adapters pattern
- ✅ **Repository Pattern** - Data access abstraction
- ✅ **Service Layer** - Pure business logic
- ✅ **Dependency Injection** - Everything mockable/testable
- ✅ **Domain-Driven Design** - Clear separation of concerns

### Infrastructure (Ready to Use)
- ✅ **Database** - Prisma (swap to Mongo/Supabase via adapter)
- ✅ **API** - tRPC (swap to REST/GraphQL via adapter)
- ✅ **Logging** - Port interface (swap Console → Winston → Datadog)
- ✅ **Caching** - Port interface (swap InMemory → Redis)
- ✅ **Events** - Port interface (swap InMemory → RabbitMQ → Kafka)
- ✅ **Error Messages** - ONE centralized file
- ✅ **Env Vars** - Type-safe, easy to add

### Third-Party Integrations (Decoupled)
- ✅ **AI/LLM** - Port interface (swap OpenAI → Claude → Local)
- ✅ **Email** - Port interface (swap SendGrid → Postmark → SES)
- ✅ **Payment** - Port interface (swap Stripe → PayPal → Square)
- ✅ **Storage** - Port interface (swap S3 → R2 → Local)
- ✅ **Analytics** - Port interface (swap Mixpanel → Segment)
- ✅ **Search** - Port interface (swap Algolia → Meilisearch)

### Quality Enforcement (AI-Proof)
- ✅ **TypeScript Strict** - 30+ flags, blocked imports
- ✅ **Pre-commit Hooks** - 5 validators
- ✅ **Biome** - Linting + formatting
- ✅ **Testing** - Vitest, Playwright, MSW ready

## How to Use This Template

### 1. Clone for New Project
```bash
git clone <this-repo> my-recipe-app
cd my-recipe-app
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your values
npx prisma migrate dev
```

### 3. Add Your First Route (Auto-Scaffold)
```bash
npm run add:route recipe
```

**This creates:**
- `core/domain/recipe.entity.ts` - Domain model
- `core/ports/recipe.repository.port.ts` - Repository interface
- `core/services/recipe.service.ts` - Business logic (you fill in TODOs)
- `infrastructure/db/prisma-recipe.adapter.ts` - Database adapter
- `infrastructure/api/recipe.router.ts` - tRPC endpoints
- `*.test.ts` - Unit and integration tests

### 4. Implement Business Logic
```typescript
// core/services/recipe.service.ts
async create(data: CreateRecipeDTO): Promise<Recipe> {
  // TODO: Add your business logic here ← YOU FILL THIS
  RecipeRules.validateTitle(data.title);
  RecipeRules.validateServings(data.servings);
  
  // Check for duplicates
  const existing = await this.deps.repository.findMany({ 
    title: data.title 
  });
  
  if (existing.length > 0) {
    throw new Error(ErrorMessages.RECIPE_DUPLICATE_TITLE);
  }
  
  return this.deps.repository.create(data);
}
```

### 5. Add Custom Error Messages
```typescript
// src/lib/error-messages.ts - ONE FILE for all errors
export const ErrorMessages = {
  // Add your errors here
  RECIPE_NOT_FOUND: 'Recipe not found',
  RECIPE_DUPLICATE_TITLE: 'A recipe with this title already exists',
  RECIPE_INVALID_SERVINGS: 'Servings must be a positive number',
} as const;
```

### 6. Add Environment Variables
```typescript
// src/lib/env.ts - Just add here
const envSchema = z.object({
  // ... existing vars
  
  // Add yours:
  OPENAI_API_KEY: z.string().optional(),
  STRIPE_SECRET: z.string().optional(),
});
```

### 7. Add Third-Party Integration
```typescript
// Example: Add AI integration
// src/infrastructure/integrations/openai.adapter.ts - Already there!

// Use in service:
export class RecipeService {
  constructor(private deps: {
    repository: IRecipeRepository;
    logger: ILogger;
    aiProvider: IAIProvider; // ← Add integration
  }) {}
  
  async generateRecipe(ingredients: string[]): Promise<Recipe> {
    const prompt = `Create recipe with: ${ingredients.join(', ')}`;
    const text = await this.deps.aiProvider.generateText(prompt);
    // Parse and save...
  }
}
```

### 8. Run & Test
```bash
npm run dev       # Development server
npm test          # Run tests
npm run build     # Production build
```

## Swapping Frameworks/Services

### Swap Database (Prisma → MongoDB)
```bash
# 1. Generate MongoDB adapter
npm run add:route recipe --adapter=mongo

# 2. Update composition root
// infrastructure/api/recipe.router.ts
- import { PrismaRecipeRepository } from '../db/prisma-recipe.adapter';
+ import { MongoRecipeRepository } from '../db/mongo-recipe.adapter';

- const repo = new PrismaRecipeRepository(db, logger);
+ const repo = new MongoRecipeRepository(mongoClient, logger);
```

### Swap UI Framework (Tailwind → Bootstrap)
```typescript
// src/app/components/ui/button.tsx
- import { Button as CustomButton } from './custom';
+ import { Button as BootstrapButton } from 'react-bootstrap';

export function Button(props) {
-  return <CustomButton {...props} />;
+  return <BootstrapButton {...props} />;
}

// All app code unchanged!
```

### Swap AI Provider (OpenAI → Claude)
```typescript
// Create: infrastructure/integrations/claude.adapter.ts
export class ClaudeAdapter implements IAIProvider {
  async generateText(prompt: string): Promise<string> {
    // Claude API implementation
  }
}

// Update composition root:
- const ai = new OpenAIAdapter(env.OPENAI_API_KEY, logger);
+ const ai = new ClaudeAdapter(env.ANTHROPIC_API_KEY, logger);
```

## Architecture Patterns

### Hexagonal (Ports & Adapters)
```
core/              ← Pure business logic (NO framework code)
  domain/          ← Entities, value objects, business rules
  ports/           ← Interfaces (IRepository, ILogger, IAIProvider)
  services/        ← Business logic using ONLY ports

infrastructure/    ← Framework implementations (SWAPPABLE)
  db/              ← Prisma, Mongo, InMemory adapters
  integrations/    ← OpenAI, Stripe, SendGrid adapters
  api/             ← tRPC routers (wire services to API)
```

### Dependency Flow
```
API Layer (tRPC)
    ↓ depends on
Service Layer (Business Logic)
    ↓ depends on
Port Interfaces (Contracts)
    ↑ implemented by
Adapters (Prisma, OpenAI, etc.)
```

**Core NEVER depends on Infrastructure.**
**Infrastructure implements Core interfaces.**

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Quality
npm run lint             # Biome check
npm run typecheck        # TypeScript validation
npm test                 # Run tests
npm run validate         # All checks

# Database
npm run db:migrate       # Prisma migrate
npm run db:studio        # Prisma Studio

# Scaffolding
npm run add:route <name> --adapter=prisma  # Add new route
```

## AI-Proof Enforcement

### What AI CANNOT Do (Blocked)
❌ Create new PrismaClient instances (pre-commit fails)
❌ Import Prisma in core layer (TypeScript error)
❌ Use console.log in services (pre-commit fails)
❌ Create custom error classes (use ErrorMessages)
❌ Import framework code in domain (TypeScript error)

### What AI CAN Do
✅ Implement business logic in services
✅ Add validation rules in EntityRules
✅ Write tests (following patterns)
✅ Add routes (following scaffolded structure)
✅ Add error messages to ErrorMessages file
✅ Copy example pattern for new entities

## Example Workflows

### Building a Recipe App
1. `npm run add:route recipe`
2. Update `ErrorMessages` with recipe errors
3. Implement `RecipeRules` validation
4. Implement `RecipeService` business logic
5. Add `OPENAI_API_KEY` to env for AI suggestions
6. Create `RecipeAISuggestionsService` using `IAIProvider`
7. Test and deploy

### Building a Graph Visualization
1. `npm run add:route node`
2. `npm run add:route edge`
3. Implement graph algorithms in services
4. Add D3.js components in frontend
5. Use existing pagination for node lists
6. Done

### Building an NLP Pipeline
1. `npm run add:route document`
2. Add `IAIProvider` for embeddings
3. Add `ISearchProvider` for vector search
4. Implement analysis in `DocumentService`
5. Use existing state management
6. Done

## Stack (DECIDED - Don't Change)

- ✅ **React 19**
- ✅ **Next.js 15**
- ✅ **Nx** (for monorepo tooling)
- ✅ **TypeScript** (strict mode)
- ✅ **Prisma** (swappable via adapter)
- ✅ **tRPC** (swappable via adapter)
- ✅ **Zustand** (state management)
- ✅ **Vitest** (testing)

---

**Clone this template. Add routes. Build features. Ship apps.**
