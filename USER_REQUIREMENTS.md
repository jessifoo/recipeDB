# 📋 User Requirements - Complete List

**Source:** Chat conversation
**Date:** 2025-10-12

## Core Requirements

### 1. Code Quality Standards
- ✅ **Google-level code quality** - "as if this were a code test for Google"
- ✅ **Not "simple code"** - Simple means FEW FILES, not basic/dumbed-down code
- ✅ **Senior engineer level** - User has 10+ years experience, CS + Physics degree
- ✅ **Elevated thinking** - No basic patterns, use proper architecture

### 2. Architecture Principles
- ✅ **Separation of concerns** - Must use proper layering
- ✅ **Test-driven development** - Think "easy to test" first
- ✅ **Hexagonal architecture (Ports & Adapters)** - Business logic framework-independent
- ✅ **Dependency injection** - Everything testable with mocked dependencies
- ✅ **SOLID principles** - Interface segregation, single responsibility, etc.

### 3. Framework Choices (FIXED)
- ✅ **React/Next.js STAYS** - Too integrated with build optimization to swap
- ✅ **TypeScript (strict mode)** - All typed, compile-time error enforcement
- ✅ **Nx** - Chosen for generators and monorepo tooling
- ✅ **tRPC** - Type-safe API layer (but swappable to REST/GraphQL if needed)

### 4. Swappable Components
- ✅ **Database adapters** - Easy to swap Prisma → MongoDB → PostgreSQL
- ✅ **Domain logic** - Recipe app → E-commerce → User management
- ✅ **Translation layers** - Work with any adapter (within reason)
- ✅ **UI frameworks** - Possible to swap (though React is preferred default)

### 5. Fixed Frontend Scaffold (Built Once, Use Forever)
- ✅ **Global state management** - Zustand, already set up for new state objects
- ✅ **Pagination** - Built and working, reusable everywhere
- ✅ **Browser history/URL state** - nuqs integration, working out of box
- ✅ **Search/Filter components** - Debounced, URL-synced
- ✅ **Form management** - React Hook Form + Zod validation

### 6. Generator System (Nx)
- ✅ **ONE command creates everything** - Remove ALL tiny decisions
- ✅ **Complete feature scaffolding** - Entity, service, adapter, router, tests
- ✅ **Enforced patterns** - AI can't deviate from generator structure
- ✅ **Database adapter selection** - Choose Prisma/Mongo/InMemory at generation
- ✅ **Auto-update Prisma schema** - Generator modifies schema.prisma

### 7. AI-Proof Enforcement
- ✅ **TypeScript path blocking** - Compile errors for bad imports (Prisma in core, etc.)
- ✅ **Pre-commit validators** - Block duplicate implementations
- ✅ **No escape hatches** - Zero tolerance for hacky code
- ✅ **Port interfaces only** - Core layer uses ONLY interfaces, never implementations
- ✅ **Prevent framework coupling** - Core business logic has ZERO framework dependencies

### 8. File Organization
- ✅ **Minimal file count** - "Not a billion files"
- ✅ **Clean structure** - No conflicting patterns
- ✅ **One pattern per concern** - ONE way to do logging, errors, data access, etc.

## Specific Technical Decisions

### Frontend (Fixed Scaffold)
```
✅ Next.js 15 + React 19
✅ Zustand (global state)
✅ React Hook Form (forms)
✅ nuqs (URL state)
✅ TanStack Query + tRPC (server state)
✅ Zod (validation)
```

### Backend (Swappable)
```
✅ TypeScript strict mode (30+ flags)
✅ Prisma (default, swappable to Mongo/DynamoDB)
✅ tRPC (default, swappable to REST/GraphQL)
✅ Repository pattern (port interfaces)
✅ Service layer (pure business logic)
```

### Testing
```
✅ Vitest (unit tests)
✅ Testing Library (component tests)
✅ Playwright (E2E)
✅ MSW (API mocking)
✅ In-Memory adapters (integration tests without DB)
```

### Tooling
```
✅ Nx (generators + monorepo)
✅ Biome (lint + format)
✅ Husky (pre-commit hooks)
✅ Custom validators (enforce patterns)
```

## What User Explicitly Requested

### From Chat Messages

1. **"Must use separation of concerns"**
   - Implemented: Core → Domain → Infrastructure layers

2. **"Must be test driven development as in think easy to test"**
   - Implemented: Dependency injection, port interfaces, mockable everything

3. **"Must follow gold standard code practices as if this were a code test for Google"**
   - Implemented: Hexagonal architecture, SOLID, DI, comprehensive docs

4. **"I want to be able to change ui frameworks, or db, and everything else still just works"**
   - Implemented: Port interfaces, adapters for Prisma/Mongo/InMemory

5. **"React stays, that's too annoying to swap out"**
   - Implemented: React/Next.js is fixed, well-integrated

6. **"Build out the global state management system already set up to take in new state objects"**
   - Implemented: Zustand stores, createPaginationStore factory

7. **"Pagination and browser history works"**
   - Implemented: Pagination component, nuqs URL state hooks

8. **"All things that every web app will always need but the design or the db and the type of app and logic will change"**
   - Implemented: Fixed frontend scaffold, swappable domain/database

9. **"I chose nx for a reason"**
   - Implemented: Nx generators for feature scaffolding

10. **"I want all typescript and typed everything to enforce compile time errors for the ai"**
    - Implemented: Strict TypeScript, blocked imports, type-safe ports

11. **"I want generators to remove all of the tiny decisions I've already made"**
    - Implemented: `nx g feature` creates complete CRUD with adapters

12. **"Google level quality"**
    - Implemented: See docs/GOOGLE_QUALITY.md

13. **"Easy to change out specifically prisma for mongo for postgres"**
    - Implemented: Repository ports, multiple adapter templates

14. **"Translation layers can work with any adapter (within reason)"**
    - Implemented: IRepository interface works with Prisma/Mongo/InMemory/etc.

15. **"Not a billion files"**
    - Implemented: Cleaned up, ~25 files for complete feature

16. **"At what point do you fix and or clean up what you already wrote?"**
    - Completed: Deleted conflicting files, documented clean state

## Problems User Identified

1. **"You keep adding more and more code but we have a MESS right now"**
   - ✅ Fixed: Deleted old architectures, cleaned up conflicts
   - ✅ Fixed: Documented final clean state in CURRENT_STATE.md

2. **Initial complexity** - Too many files, over-engineered
   - ✅ Fixed: Simplified to ~25 files per feature with generator

3. **Conflicting patterns** - Multiple ways to do same thing
   - ✅ Fixed: ONE pattern enforced by generator + validators

## Final Deliverables

### Working Code
- ✅ Clean hexagonal architecture
- ✅ Working example feature (tests pass)
- ✅ Nx generator for new features
- ✅ Frontend components (pagination, search)
- ✅ State management (Zustand + nuqs)
- ✅ Multiple database adapters (Prisma, Mongo, InMemory)

### Documentation
- ✅ README.md - Quick start guide
- ✅ CURRENT_STATE.md - Current clean architecture
- ✅ ARCHITECTURE.md - Architecture principles
- ✅ docs/GENERATOR_GUIDE.md - How to use generators
- ✅ docs/GOOGLE_QUALITY.md - Quality standards
- ✅ docs/SWAP_EXAMPLES.md - How to swap databases

### Enforcement
- ✅ TypeScript strict mode (30+ flags)
- ✅ Blocked import paths (Prisma in core = compile error)
- ✅ Pre-commit validators (block bad patterns)
- ✅ Generator enforces structure

## User's Background Context

- **Experience:** 10+ years software engineering
- **Education:** Computer Science + Physics degree
- **Neurodiversity:** Gifted autistic
- **Need:** Extreme structure, no ambiguity, Google-level quality
- **Use Case:** Reusable template for multiple app ideas
- **Pain Point:** AI creating chaos in previous RecipeDB project (Python)

## Success Criteria (Implied)

✅ AI literally cannot create duplicate implementations (validators block)
✅ AI literally cannot import wrong things (TypeScript blocks)
✅ AI literally cannot deviate from structure (generator enforces)
✅ AI can ONLY fill in business logic in designated TODO sections
✅ Frontend works for ANY app without modification
✅ Database can be swapped with 1-line change
✅ Everything is testable without infrastructure
✅ No hacky code possible (enforced at compile time + pre-commit)

---

**Summary:** Build a bulletproof, AI-proof, Google-quality TypeScript template with fixed frontend, swappable backend, Nx generators that make ALL decisions, and enforcement at every level to prevent chaos.
