# @app/errors

Centralized error handling with typed error classes.

## Usage

```typescript
import {
  ValidationError,
  DatabaseError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
} from '@app/errors';

// Validation error
throw new ValidationError('Email is required', {
  field: 'email',
  value: undefined,
});

// Not found error
throw new NotFoundError('User', userId);

// Database error
try {
  await db.user.create({ data });
} catch (error) {
  throw new DatabaseError('Failed to create user', { cause: error });
}

// Auth errors
throw new AuthenticationError();
throw new AuthorizationError('Admin access required');
```

## Error Types

### ValidationError (400)
Data validation failures

### NotFoundError (404)
Resource not found

### DatabaseError (500)
Database operation failures

### AuthenticationError (401)
User not authenticated

### AuthorizationError (403)
User not authorized

## Custom Errors

Extend `BaseError`:

```typescript
import { BaseError } from '@app/errors';

export class RateLimitError extends BaseError {
  constructor(limit: number, remaining: number) {
    super(
      `Rate limit exceeded. ${remaining}/${limit} remaining`,
      'RATE_LIMIT_EXCEEDED',
      429,
      true,
      { limit, remaining }
    );
  }
}
```

## Error Response

All errors have:
- `name`: Error class name
- `code`: Machine-readable code
- `message`: Human-readable message
- `statusCode`: HTTP status code
- `context`: Additional context data
