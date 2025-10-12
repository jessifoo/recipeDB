# @app/validation

Centralized validation schemas using Zod.

## Usage

```typescript
import { common, validate } from '@app/validation';
import { z } from 'zod'; // Only import z from here!

// Create schema using common patterns
const userSchema = z.object({
  email: common.email,
  name: common.nonEmptyString,
  age: common.positiveInt,
  website: common.url.optional(),
});

// Validate data (returns Validated<T> phantom type)
const validated = validate(userSchema, rawData);

// Now you can use validated data in functions that require it
createUser(validated); // This function requires Validated<UserInput>
```

## Common Patterns

```typescript
import { common } from '@app/validation';

// IDs
common.id              // CUID
common.uuid            // UUID

// Strings
common.email           // Email validation
common.url             // URL validation
common.nonEmptyString  // Must have length
common.slug            // Lowercase alphanumeric with dashes

// Numbers
common.positiveInt     // Positive integer
common.positiveNumber  // Positive number
common.percentage      // 0-100

// Dates
common.dateString      // ISO datetime string
common.futureDate      // Must be in future

// Arrays
common.nonEmptyArray(z.string())  // Must have at least one item
common.uniqueArray(z.string())    // All items unique
```

## Pagination Schemas

```typescript
import { cursorPaginationSchema, offsetPaginationSchema } from '@app/validation';

// Cursor pagination
const cursorInput = cursorPaginationSchema.parse({
  cursor: 'abc123',
  limit: 20,
});

// Offset pagination
const offsetInput = offsetPaginationSchema.parse({
  page: 1,
  limit: 20,
});
```

## Validation Functions

### validate()
Throws ValidationError on failure:

```typescript
import { validate } from '@app/validation';

try {
  const validated = validate(schema, data);
  // validated is Validated<T>
} catch (error) {
  // error is ValidationError with formatted errors
}
```

### validateSafe()
Returns Result instead of throwing:

```typescript
import { validateSafe } from '@app/validation';

const result = validateSafe(schema, data);

if (result.success) {
  console.log(result.data); // Validated<T>
} else {
  console.log(result.error); // ZodError
}
```

## Rules

❌ **DO NOT** use `z.object()` directly outside this package
❌ **DO NOT** create schemas in random files
✅ **DO** add schemas to this package
✅ **DO** use common patterns
✅ **DO** use validate() function for phantom types
