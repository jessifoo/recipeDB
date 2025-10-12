# RecipeDB

A recipe database application built with Next.js, TypeScript, and comprehensive AI development guardrails.

## Project Philosophy

This project was created to solve a common problem: **AI-generated code chaos**. After experiencing the pain of maintaining AI-generated Python code with multiple logging implementations, inconsistent patterns, and broken imports, this project implements strict architectural guardrails to prevent those issues.

### Key Principles

1. **Centralized Systems**: One canonical implementation for each cross-cutting concern
2. **Automatic Enforcement**: ESLint, TypeScript, and pre-commit hooks prevent violations
3. **AI-Friendly Architecture**: Clear constraints that guide AI (and humans) to the right patterns
4. **Type Safety First**: Strict TypeScript catches errors at compile-time

## Getting Started

### Installation

```bash
# Install dependencies (using pnpm)
pnpm install

# Setup git hooks
pnpm run prepare
```

### Development

```bash
# Start development server
pnpm dev

# Run linting
pnpm lint

# Run tests
pnpm test

# Validate everything (lint + test + custom checks)
pnpm validate
```

## Architecture

This is an Nx monorepo with strict architectural boundaries:

```
workspace/
├── packages/           # Centralized, reusable systems
│   └── logger/        # Centralized logging (ONLY logger allowed)
├── frontend/          # Next.js application
└── scripts/           # Validation and enforcement scripts
```

### Centralized Systems (CRITICAL)

This codebase uses **centralized systems** for cross-cutting concerns. You MUST use these systems - creating alternatives will fail linting and pre-commit checks.

#### Logging

**✅ Correct Usage:**
```typescript
import { logger } from '@recipedb/logger';

logger.info('User logged in', { userId: 123 });
logger.error('Failed to save', error);
```

**❌ Forbidden (will fail linting):**
```typescript
console.log('anything');        // ESLint error
import winston from 'winston';  // ESLint error
// Creating logger.ts anywhere  // Pre-commit hook blocked
```

**Enforcement:**
- ESLint `no-console` rule
- ESLint `no-restricted-imports` for winston, pino, bunyan, etc.
- Pre-commit hook scans for logging files
- TypeScript import path restrictions

See [`AI_CODING_RULES.md`](./AI_CODING_RULES.md) and [`ARCHITECTURE.md`](./ARCHITECTURE.md) for complete details.

## Tech Stack

- **Frontend**: Next.js 15 + React 19
- **Language**: TypeScript (strict mode)
- **Monorepo**: Nx
- **Testing**: Jest + React Testing Library + Playwright
- **Linting**: ESLint + Prettier
- **Package Manager**: pnpm

## Development Workflow

### Before Committing

```bash
# Validate everything
pnpm validate

# Or individually
pnpm lint
pnpm test
pnpm validate:logging
```

### Pre-commit Hooks

Git hooks automatically run on commit:
1. Logging violation scanner
2. ESLint with auto-fix
3. Prettier formatting

**If violations are found, the commit is blocked.**

## Documentation

- [`AI_CODING_RULES.md`](./AI_CODING_RULES.md) - Rules for AI assistants (and humans)
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - System architecture and patterns
- [`EXAMPLES.md`](./EXAMPLES.md) - Code examples and usage patterns

## Project Status

🚧 **Early Development** - Infrastructure and guardrails are in place, core features coming soon.

### Implemented
- ✅ Centralized logging system
- ✅ ESLint enforcement
- ✅ Pre-commit hooks
- ✅ TypeScript strict mode
- ✅ Testing infrastructure

### Planned
- 🔜 Database layer (Prisma)
- 🔜 Recipe CRUD operations
- 🔜 User authentication
- 🔜 Search and filtering
- 🔜 Recipe collections

## Why These Guardrails?

Traditional AI-assisted development often results in:
- Multiple logging implementations scattered everywhere
- Broken imports and undefined variables
- Inconsistent code patterns
- Runtime errors instead of compile-time safety

This project prevents those issues through:
- **TypeScript**: Catch errors at compile-time
- **ESLint**: Enforce patterns automatically
- **Centralized Systems**: One implementation, enforced everywhere
- **Pre-commit Hooks**: Automatic validation before code enters the repo
- **Clear Documentation**: AI and humans know the rules

## Contributing

### Adding Features

1. Check if a centralized system exists for your use case
2. Follow the patterns in `EXAMPLES.md`
3. Write tests for new code
4. Run `pnpm validate` before committing
5. Ensure all pre-commit hooks pass

### Creating New Centralized Systems

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the template and checklist.

## License

MIT

## Author

Jessica Johnson <2334167+jessifoo@users.noreply.github.com>
