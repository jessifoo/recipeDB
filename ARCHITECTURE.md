# RecipeDB Architecture

## Centralized Systems Philosophy

**Core Principle:** One canonical implementation for each cross-cutting concern.

### Why Centralization?

- **Consistency**: Same behavior everywhere
- **Maintainability**: Single point of change
- **Debugging**: One place to add instrumentation
- **Testing**: Test once, trust everywhere
- **AI Safety**: Prevents AI from creating duplicates

## Current Centralized Systems

### 1. Logging (`@recipedb/logger`)

**Location:** `packages/logger/src/index.ts`

**Purpose:** All logging across the entire application

**Enforcement:**
- ESLint `no-console` rule (error)
- ESLint `no-restricted-imports` for winston, pino, etc.
- Pre-commit hook scanning for violations
- TypeScript path mapping to single source

**Usage:**
```typescript
import { logger } from '@recipedb/logger';
logger.info('message', { optional: 'data' });
```

**Adding Features:**
- Edit `packages/logger/src/index.ts` ONLY
- Do NOT create new logging files anywhere
- Update the centralized Logger class

## Future Centralized Systems

### Database Access (Planned)
- **Package:** `@recipedb/database`
- **Purpose:** Single Prisma client instance
- **Prevents:** Multiple database connections, query fragmentation

### Validation (Planned)
- **Package:** `@recipedb/validation`
- **Purpose:** Zod schemas, input validation
- **Prevents:** Duplicate validation logic

### Authentication (Planned)
- **Package:** `@recipedb/auth`
- **Purpose:** Auth logic, token management
- **Prevents:** Multiple auth implementations

## Workspace Structure

```
workspace/
├── packages/              # Centralized, reusable systems
│   ├── logger/           # ✅ Logging (implemented)
│   ├── database/         # 🔜 Database client (planned)
│   ├── validation/       # 🔜 Validation schemas (planned)
│   └── auth/             # 🔜 Authentication (planned)
│
├── frontend/             # Next.js application
│   └── src/
│       ├── app/          # App router pages
│       ├── components/   # React components
│       └── lib/          # Frontend-specific utilities
│
└── backend/              # Fastify API (planned)
    └── src/
        ├── routes/       # API endpoints
        ├── services/     # Business logic
        └── lib/          # Backend-specific utilities
```

## Adding New Centralized Systems

### Template Checklist

When creating a new centralized system:

1. **Create Package**
   ```bash
   mkdir -p packages/[name]/src
   ```

2. **Add package.json**
   ```json
   {
     "name": "@recipedb/[name]",
     "main": "./src/index.ts",
     "exports": { ".": "./src/index.ts" }
   }
   ```

3. **Add to tsconfig.base.json paths**
   ```json
   {
     "paths": {
       "@recipedb/[name]": ["packages/[name]/src/index.ts"]
     }
   }
   ```

4. **Add ESLint enforcement**
   - `no-restricted-imports` for alternatives
   - Custom rules if needed

5. **Add validation script**
   - Create `scripts/validate-[name].js`
   - Scan for violations
   - Add to pre-commit hook

6. **Document in AI_CODING_RULES.md**
   - Show correct usage
   - List forbidden patterns
   - Explain enforcement

7. **Add README to package**
   - Usage examples
   - Rules and enforcement
   - Common patterns

## Design Principles

### 1. Singleton Pattern
Most centralized systems use singleton pattern:
```typescript
class System {
  private static instance: System;
  static getInstance() { ... }
}
export const system = System.getInstance();
```

### 2. Single Export
```typescript
// packages/[name]/src/index.ts
export const system = System.getInstance();
export { SystemClass }; // For testing/extension only
```

### 3. Comprehensive Documentation
Every centralized system MUST have:
- Package README with examples
- Entry in AI_CODING_RULES.md
- Entry in this ARCHITECTURE.md

### 4. Automatic Enforcement
Every centralized system MUST have:
- ESLint rules preventing alternatives
- TypeScript import path restrictions
- Pre-commit hook validation (if applicable)

## Benefits

### For Human Developers
- Predictable patterns
- Easy to find implementations
- Clear mental model
- Reduced cognitive load

### For AI Assistants
- Clear constraints
- Cannot create duplicates (enforced)
- Obvious where to add features
- Self-documenting structure

### For the Codebase
- Maintainable
- Testable
- Consistent
- Auditable

## Anti-Patterns to Avoid

❌ Creating utilities in multiple places:
```
frontend/src/utils/logger.ts  ❌
backend/src/utils/logger.ts   ❌
packages/shared/log.ts        ❌
```

✅ One centralized implementation:
```
packages/logger/src/index.ts  ✅
```

❌ Importing external libraries directly:
```typescript
import winston from 'winston';  ❌
```

✅ Using centralized wrapper:
```typescript
import { logger } from '@recipedb/logger';  ✅
```

## Validation

Run validation before committing:
```bash
npm run validate
```

This checks:
- ESLint rules (including centralization rules)
- TypeScript compilation
- Tests
- Custom validation scripts (logging, etc.)
