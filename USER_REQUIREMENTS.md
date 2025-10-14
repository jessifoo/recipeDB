# 📋 User Requirements - CORRECTED Understanding

## What User ACTUALLY Wants

### ❌ WRONG Understanding
- Generator that creates features on demand
- Run `nx g feature` for each new entity
- Build features incrementally in one app

### ✅ CORRECT Understanding
**A complete, production-ready TEMPLATE REPOSITORY that:**

1. **Clone once per app idea**
   - RecipeDB → clone template, swap domain to "Recipe"
   - E-commerce → clone template, swap domain to "Product"  
   - Blog → clone template, swap domain to "Post"

2. **Already 100% working**
   - All infrastructure in place
   - Frontend complete (pagination, search, state)
   - Backend architecture established
   - Example domain showing the pattern
   - Tests passing

3. **Just swap the domain**
   - Replace `example` entity with your entity
   - Update business rules
   - Modify Prisma schema
   - Everything else stays the same

4. **Start building features immediately**
   - Add more routes by copying the example pattern
   - No generators needed - just copy/paste/modify
   - AI fills in business logic following the pattern

## Core Vision (From Full Chat History)

### Original Problem
- AI created chaos in Python RecipeDB
- Multiple logging systems, scattered code
- Couldn't enforce centralization

### Solution Requirements
1. **Reusable Template** - "Template I'll use for ANY idea moving forward"
2. **All Basics Included** - Auth, pagination, state management, etc.
3. **AI-Proof** - Literally impossible for AI to cut corners
4. **Maximum Enforcement** - Zero escape hatches
5. **Simple = Few Files** - Not "basic code" but minimal file count
6. **Google-Level Quality** - Senior engineer standards
7. **Swappable Backend** - Easy to change database, domain logic
8. **Fixed Frontend** - React/Next.js stays (too integrated to swap)

## User Background

- **Experience:** 10+ years software engineering
- **Education:** CS + Physics degree
- **Neurodiversity:** Gifted autistic (needs structure, no ambiguity)
- **Use Case:** Multiple app ideas, need consistent foundation
- **Pain Point:** AI creating messy, duplicated code

## Template Structure

### What's FIXED (Never Changes)
```
Frontend Infrastructure:
✅ React 19 + Next.js 15 (App Router)
✅ Zustand (global state management)
✅ nuqs (URL state - pagination, filters, tabs)
✅ React Hook Form + Zod (forms)
✅ TanStack Query + tRPC (server state)
✅ Pagination component (working)
✅ SearchFilter component (debounced, URL-synced)
✅ Theme system
✅ Auth UI (NextAuth v5 ready)

Backend Architecture:
✅ Hexagonal (Ports & Adapters)
✅ Repository pattern (IRepository interface)
✅ Service layer (pure business logic)
✅ Dependency injection
✅ Domain-driven design
✅ Error handling (TRPCError)
✅ Logging (ILogger port)
✅ Caching (ICache port)
✅ Event bus (IEventBus port)

Enforcement:
✅ TypeScript strict (30+ flags)
✅ Blocked imports (compile errors)
✅ Pre-commit validators (5 checks)
✅ Biome linting
✅ Testing setup (Vitest, Playwright, MSW)
```

### What CHANGES Per App (Domain)
```
Just Swap These:
📝 Domain entity (example.entity.ts → recipe.entity.ts)
📝 Business rules (RecipeRules)
📝 Service logic (RecipeService)
📝 Repository implementation (if needed)
📝 Prisma schema model
📝 tRPC router
📝 Tests

Everything Else Stays:
✅ All frontend components
✅ All infrastructure
✅ All patterns
✅ All enforcement
```

## How Template Works

### For RecipeDB App:
1. Clone template repo
2. Rename `example` → `recipe` in:
   - `core/domain/example.entity.ts` → `recipe.entity.ts`
   - `core/services/example.service.ts` → `recipe.service.ts`
   - `infrastructure/db/prisma.adapter.ts` (update model)
   - `infrastructure/api/trpc.adapter.ts` (update router)
3. Update Prisma schema: `Example` → `Recipe`
4. Implement RecipeRules, RecipeService logic
5. Done - everything else works

### For E-Commerce App:
1. Clone template repo (fresh copy)
2. Rename `example` → `product`
3. Update Prisma schema: `Example` → `Product`
4. Implement ProductRules, ProductService
5. Done

### For Blog App:
1. Clone template repo (fresh copy)
2. Rename `example` → `post`
3. Update schema, implement PostRules
4. Done

## What AI Does

### AI CAN Do:
✅ Implement business logic in services
✅ Add validation in EntityRules classes
✅ Write domain-specific queries in repositories
✅ Create new tRPC endpoints (following example pattern)
✅ Write tests (following example pattern)
✅ Copy/paste example pattern for new entities

### AI CANNOT Do (Blocked):
❌ Create new PrismaClient instances
❌ Import Prisma in core layer (compile error)
❌ Use console.log in services
❌ Create custom error classes
❌ Import framework code in domain layer
❌ Deviate from established patterns

## Template Repository Contents

### Example Domain (Pattern to Follow)
```
✅ Example entity (shows domain modeling)
✅ Example service (shows business logic structure)
✅ Example repository (shows data access)
✅ Example router (shows API endpoints)
✅ Example tests (shows testing patterns)
✅ All working, all tested
```

### Frontend (Complete)
```
✅ Pagination with URL sync
✅ Search with debounce
✅ Global state (Zustand)
✅ URL state (nuqs)
✅ Form patterns (React Hook Form)
✅ Auth UI ready
```

### Infrastructure (Complete)
```
✅ Database adapters (Prisma, Mongo, InMemory)
✅ Logger adapter (Console, swappable to Winston)
✅ Cache adapter (InMemory, swappable to Redis)
✅ Event bus adapter (InMemory, swappable to RabbitMQ)
✅ All ports defined
```

### Enforcement (Active)
```
✅ Pre-commit hooks (5 validators)
✅ TypeScript strict mode
✅ Blocked imports
✅ Biome rules
✅ Test requirements
```

### Documentation (Complete)
```
✅ README.md - How to use template
✅ ARCHITECTURE.md - Architecture guide
✅ CURRENT_STATE.md - Current clean state
✅ docs/GOOGLE_QUALITY.md - Quality standards
✅ docs/SWAP_EXAMPLES.md - How to swap databases
```

## Usage Pattern

### Starting New App
```bash
# 1. Clone template
git clone <template-repo> my-recipe-app
cd my-recipe-app

# 2. Install & setup
npm install
cp .env.example .env
npx prisma migrate dev

# 3. Swap domain (manual find/replace or script)
# Replace "example" with "recipe" in relevant files
# Update Prisma schema

# 4. Implement business logic
# Fill in RecipeRules, RecipeService methods

# 5. Run
npm run dev

# 6. Add more entities by copying example pattern
cp core/domain/example.entity.ts core/domain/ingredient.entity.ts
# Modify for Ingredient...
```

## Key Requirements (From Chat History)

### Session 1: Initial Vision
- "Template I'll use for ANY idea moving forward"
- "Routes so consistent you can automate the whole thing"
- "Easy to follow, maintain, debug, test, swap"
- "ONE error object, ONE logging service"
- "Full end-to-end working example"
- "Leverage framework features (use Next.js errors, don't reinvent)"

### Session 2: Quality Standards
- "Not a billion files" (simple = few files)
- "I'm a software engineer with 10+ years, CS + Physics degree, gifted autistic"
- "I REQUIRE you to elevate the code quality level"
- "Google-level quality - as if this were a code test for Google"
- "Separation of concerns, TDD, gold standard practices"

### Session 3: Swappability
- "I want to be able to change UI frameworks, or db, and everything else still just works"
- "React stays, that's too annoying to swap out"
- "Pagination and browser history works"
- "All things every web app needs, but domain logic changes"

### Session 4: Stack Decisions
- "I chose nx for a reason" (but NOT for feature generation)
- "All TypeScript, typed everything, compile-time errors for AI"
- "Backend chosen too" (Prisma, tRPC, etc. - all decided)

### Session 5: Quality + Swappability
- "Google level quality"
- "Easy to change Prisma for Mongo for Postgres"
- "Translation layers work with any adapter"

### Session 6: Cleanup
- "You keep adding more code but we have a MESS"
- "At what point do you fix and clean up?"
- Led to deletion of conflicts, clean architecture

### Session 7: CLARIFICATION
- "I do NOT want everything generated from one command"
- "That's absurd"
- "I want this template repo ready to go for any web app"

## Final Understanding

### What Template Is:
✅ **Complete, working starter repository**
✅ **Clone once per new app idea**
✅ **All infrastructure in place**
✅ **Example domain showing patterns**
✅ **Just swap domain and build**

### What Template Is NOT:
❌ Feature generator system
❌ Incremental scaffolding tool
❌ CLI that creates routes on demand
❌ Code generator for ongoing development

## Success Criteria

### Template Must:
1. ✅ Work out of the box (npm install → npm run dev)
2. ✅ Have ALL frontend infrastructure complete
3. ✅ Have example domain fully implemented
4. ✅ Show patterns for: CRUD, auth, testing, caching, events
5. ✅ Be swappable (Prisma → Mongo with minimal changes)
6. ✅ Enforce quality (TypeScript, validators, pre-commit)
7. ✅ Prevent AI chaos (blocked imports, validators)
8. ✅ Have ~25 core files (not "a billion")
9. ✅ Documentation clear on how to swap domain
10. ✅ Ready to clone for: RecipeDB, E-commerce, Blog, etc.

### Developer Workflow:
1. Clone template
2. Find/replace domain (example → recipe)
3. Update Prisma schema
4. Implement business logic
5. Copy example pattern for new entities
6. Ship app

### AI Workflow:
1. User says "add ingredient management"
2. AI copies example pattern
3. AI creates ingredient.entity.ts (following example.entity.ts)
4. AI creates ingredient.service.ts (following example.service.ts)
5. AI implements business logic
6. Validators prevent bad code
7. TypeScript prevents bad imports
8. Pre-commit ensures quality

---

**CORRECTED SUMMARY:**

Build a complete, production-ready template repository with:
- ✅ All frontend infrastructure (complete, tested, working)
- ✅ Hexagonal backend architecture (established patterns)
- ✅ Example domain (copy this for new entities)
- ✅ Database swappability (port interfaces)
- ✅ AI-proof enforcement (validators, TypeScript)
- ✅ Clone → Swap domain → Build app
- ✅ NOT a code generator - a TEMPLATE
