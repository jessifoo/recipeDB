# 🎨 Feature Generator - Zero Decision Development

## The Goal

**ONE command. EVERYTHING generated. AI just fills business logic.**

## Usage

```bash
# Generate a complete feature
nx g feature recipe --fields="title:string,ingredients:string[],servings:number,vegetarian:boolean"

# Skip tests (not recommended)
nx g feature product --fields="name:string,price:number" --skipTests
```

## What Gets Created

### 1. Domain Entity
```typescript
// core/domain/recipe.entity.ts
export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  servings: number;
  vegetarian: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class RecipeRules {
  static validateTitle(title: string): void { ... }
  // Auto-generated validation for string fields
}
```

### 2. Service (Business Logic)
```typescript
// core/services/recipe.service.ts
export class RecipeService {
  async getById(id: string): Promise<Recipe> { ... }
  async list(filter?: RecipeFilter): Promise<Recipe[]> { ... }
  async create(data: CreateRecipeDTO): Promise<Recipe> { ... }
  async update(id: string, data: UpdateRecipeDTO): Promise<Recipe> { ... }
  async delete(id: string): Promise<void> { ... }
}
```

With:
- ✅ DTOs pre-generated
- ✅ Dependency injection setup
- ✅ Cache integration
- ✅ Event publishing
- ✅ Validation hooks
- ✅ TODO comments for business logic

### 3. Prisma Adapter
```typescript
// infrastructure/db/prisma-recipe.adapter.ts
export class PrismaRecipeRepository implements IRepository<Recipe> {
  async findById(id: string): Promise<Recipe | null> { ... }
  async findMany(filter?: RecipeFilter): Promise<Recipe[]> { ... }
  // ... full CRUD
}
```

With:
- ✅ Error handling
- ✅ Logging
- ✅ Search implementation (for string fields)

### 4. tRPC Router
```typescript
// infrastructure/api/recipe.router.ts
export const recipeRouter = router({
  getById: publicProcedure.input(z.string()).query(...),
  list: publicProcedure.input(filterSchema).query(...),
  create: publicProcedure.input(createSchema).mutation(...),
  update: publicProcedure.input(updateSchema).mutation(...),
  delete: publicProcedure.input(z.string()).mutation(...),
});
```

With:
- ✅ Zod schemas auto-generated
- ✅ Service wiring (DI)
- ✅ Error handling
- ✅ Type-safe endpoints

### 5. Unit Tests
```typescript
// core/services/recipe.service.test.ts
describe('RecipeService', () => {
  // Mocked dependencies
  // Test structure ready
  // TODO: Fill in edge cases
});
```

### 6. Prisma Schema Update
```prisma
model Recipe {
  id          String   @id @default(cuid())
  title       String
  ingredients String[]
  servings    Int
  vegetarian  Boolean
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Auto-appended to `prisma/schema.prisma`

## Field Type Mapping

### Supported Types

| TypeScript Type | Zod Schema | Prisma Type |
|----------------|------------|-------------|
| `string` | `z.string()` | `String` |
| `number` | `z.number()` | `Int` |
| `boolean` | `z.boolean()` | `Boolean` |
| `date` | `z.date()` | `DateTime` |
| `string[]` | `z.array(z.string())` | `String[]` |
| `number[]` | `z.array(z.number())` | `Int[]` |

### Optional Fields

```bash
# Use ? for optional fields
nx g feature user --fields="name:string,bio:string?,age:number?"
```

Generates:
```typescript
export interface User {
  name: string;
  bio?: string;
  age?: number;
}
```

## After Generation

### 1. Run Migration
```bash
npx prisma migrate dev --name add-recipe
```

### 2. Wire Router
```typescript
// src/server/api/root.ts
import { recipeRouter } from '@/infrastructure/api/recipe.router';

export const appRouter = router({
  recipe: recipeRouter, // Add this line
  // ... other routers
});
```

### 3. Implement Business Logic
Open `core/services/recipe.service.ts` and fill in the `TODO` sections:

```typescript
async create(data: CreateRecipeDTO): Promise<Recipe> {
  // Validate business rules
  RecipeRules.validateTitle(data.title);

  // TODO: Add your business logic here ⬅️ AI fills this
  // Example: Check for duplicates
  const existing = await this.deps.repository.findMany({ 
    search: data.title 
  });
  if (existing.length > 0) {
    throw new Error('Recipe with this title already exists');
  }

  const recipe = await this.deps.repository.create(data);
  // ... rest is generated
}
```

### 4. Run Tests
```bash
npm test recipe
```

### 5. Use in Frontend
```typescript
// Auto-generated tRPC client
const { data } = trpc.recipe.list.useQuery({ search: 'chocolate' });
const createMutation = trpc.recipe.create.useMutation();
```

## What AI Can Do

AI is **restricted** to:
- ✅ Adding business rules in `RecipeRules`
- ✅ Implementing service `TODO` sections
- ✅ Adding custom validation
- ✅ Writing tests
- ✅ Adding fields (re-run generator)

AI **cannot**:
- ❌ Create new PrismaClient instances
- ❌ Import Prisma directly in services
- ❌ Use console.log in business logic
- ❌ Create custom error classes
- ❌ Import tRPC in core layer

## Examples

### Recipe App
```bash
nx g feature recipe --fields="title:string,ingredients:string[],instructions:string[],prepTime:number,cookTime:number,servings:number,difficulty:string,imageUrl:string?"
```

### E-Commerce Product
```bash
nx g feature product --fields="name:string,description:string,price:number,stock:number,sku:string,category:string,tags:string[],images:string[],active:boolean"
```

### User Profile
```bash
nx g feature profile --fields="displayName:string,bio:string?,avatarUrl:string?,location:string?,website:string?,verified:boolean"
```

### Blog Post
```bash
nx g feature post --fields="title:string,slug:string,content:string,excerpt:string?,published:boolean,tags:string[],viewCount:number"
```

## Advanced Patterns

### Custom Business Rules

After generation, add to `RecipeRules`:

```typescript
export class RecipeRules {
  // Auto-generated
  static validateTitle(title: string): void { ... }

  // Add your own
  static mustHaveIngredients(recipe: CreateRecipeDTO): void {
    if (recipe.ingredients.length === 0) {
      throw new Error('Recipe must have at least one ingredient');
    }
  }

  static prepTimeMustBeRealistic(prepTime: number): void {
    if (prepTime < 1 || prepTime > 480) {
      throw new Error('Prep time must be between 1 and 480 minutes');
    }
  }
}
```

Then use in service:
```typescript
async create(data: CreateRecipeDTO): Promise<Recipe> {
  RecipeRules.validateTitle(data.title);
  RecipeRules.mustHaveIngredients(data);
  RecipeRules.prepTimeMustBeRealistic(data.prepTime);
  // ...
}
```

### Custom Filters

Extend the filter type:

```typescript
export interface RecipeFilter {
  search?: string;
  difficulty?: string;      // Add custom filters
  maxPrepTime?: number;     // Add custom filters
  vegetarian?: boolean;     // Add custom filters
}
```

Update repository:
```typescript
async findMany(filter?: RecipeFilter): Promise<Recipe[]> {
  return await this.db.recipe.findMany({
    where: {
      ...(filter?.search && {
        OR: [
          { title: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
      ...(filter?.difficulty && { difficulty: filter.difficulty }),
      ...(filter?.maxPrepTime && { prepTime: { lte: filter.maxPrepTime } }),
      ...(filter?.vegetarian !== undefined && { vegetarian: filter.vegetarian }),
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

## Troubleshooting

### "Model already exists in Prisma schema"
Generator won't overwrite existing models. Delete manually if needed.

### Tests failing after generation
Run `npx prisma generate` to update Prisma client types.

### TypeScript errors
Run `npm run typecheck` to see what needs fixing.

### Router not found
Make sure you wired it in `src/server/api/root.ts`.

---

**This generator makes 100+ tiny decisions for you. AI just fills the gaps.**
