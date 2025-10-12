# RecipeDB Code Examples

## Logging Examples

### Basic Usage

```typescript
import { logger } from '@recipedb/logger';

// Info logging
logger.info('User login successful', { userId: 123, email: 'user@example.com' });

// Warning
logger.warn('Rate limit approaching', { remaining: 10, limit: 100 });

// Error logging
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', error, { context: 'additional data' });
}

// Debug (useful during development)
logger.debug('Query executed', { sql: 'SELECT * FROM recipes', duration: 45 });
```

### In API Routes (Next.js)

```typescript
// frontend/src/app/api/recipes/route.ts
import { logger } from '@recipedb/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  logger.info('Fetching recipes');
  
  try {
    // Your logic here
    const recipes = await fetchRecipes();
    
    logger.info('Recipes fetched successfully', { count: recipes.length });
    return NextResponse.json(recipes);
  } catch (error) {
    logger.error('Failed to fetch recipes', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### In React Components

```typescript
// frontend/src/components/RecipeList.tsx
import { logger } from '@recipedb/logger';
import { useEffect, useState } from 'react';

export function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    logger.debug('RecipeList component mounted');
    
    fetchRecipes()
      .then(data => {
        setRecipes(data);
        logger.info('Recipes loaded', { count: data.length });
      })
      .catch(error => {
        logger.error('Failed to load recipes', error);
      });
  }, []);

  return (
    <div>
      {recipes.map(recipe => (
        <div key={recipe.id}>{recipe.name}</div>
      ))}
    </div>
  );
}
```

### In Server Actions (Next.js)

```typescript
// frontend/src/app/actions/recipe-actions.ts
'use server';

import { logger } from '@recipedb/logger';

export async function createRecipe(formData: FormData) {
  const name = formData.get('name');
  
  logger.info('Creating recipe', { name });
  
  try {
    // Validation
    if (!name) {
      logger.warn('Recipe creation failed: missing name');
      return { error: 'Name is required' };
    }
    
    // Database operation
    const recipe = await db.recipe.create({ data: { name } });
    
    logger.info('Recipe created successfully', { id: recipe.id, name });
    return { success: true, recipe };
  } catch (error) {
    logger.error('Failed to create recipe', error, { name });
    return { error: 'Failed to create recipe' };
  }
}
```

### Configuring Log Level

```typescript
// For development
import { logger, LogLevel } from '@recipedb/logger';

if (process.env.NODE_ENV === 'development') {
  logger.setLevel(LogLevel.DEBUG);
} else {
  logger.setLevel(LogLevel.INFO);
}
```

## What NOT to Do

### ❌ WRONG - Will Fail Linting

```typescript
// DON'T DO THIS - ESLint will error
console.log('User logged in');
console.error('Error occurred');

// DON'T DO THIS - ESLint will error
import winston from 'winston';
const logger = winston.createLogger(...);

// DON'T DO THIS - Pre-commit hook will block
// Creating file: utils/logger.ts
```

### ✅ CORRECT - Use Centralized Logger

```typescript
// DO THIS - Proper way
import { logger } from '@recipedb/logger';

logger.info('User logged in');
logger.error('Error occurred', error);
```

## Testing with Logger

```typescript
// component.test.tsx
import { logger } from '@recipedb/logger';

// Mock the logger in tests
jest.mock('@recipedb/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

test('logs error on failure', async () => {
  await failingFunction();
  
  expect(logger.error).toHaveBeenCalledWith(
    'Operation failed',
    expect.any(Error)
  );
});
```

## Future Patterns

As we add more centralized systems, they'll follow the same pattern:

```typescript
// Database
import { db } from '@recipedb/database';
const user = await db.user.findUnique({ where: { id: 1 } });

// Validation
import { validateRecipe } from '@recipedb/validation';
const result = validateRecipe(data);

// Auth
import { auth } from '@recipedb/auth';
const session = await auth.getSession();
```

**The pattern is always:**
1. Import from `@recipedb/[package]`
2. Use the exported singleton/functions
3. Never create alternatives
