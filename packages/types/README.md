# @app/types

Centralized type definitions for maximum type safety.

## Features

- **Branded Types**: Prevent mixing up primitive types (IDs, emails, URLs)
- **Phantom Types**: Ensure validation before use
- **Pagination Types**: Standard pagination across all APIs
- **API Response Types**: Consistent response format

## Usage

```typescript
import { UserId, Validated, LogLevel } from '@app/types';

// ✅ Branded IDs - cannot be mixed up
function getUser(id: UserId) { ... }

getUser(UserId('123'));        // ✅ Works
getUser('123');                // ❌ Type error
getUser(PostId('123'));        // ❌ Type error - wrong ID type!

// ✅ Validated data - must validate first
function createUser(data: Validated<UserInput>) {
  return db.user.create({ data });
}

const validated = validate(schema, rawInput);
createUser(validated);         // ✅ Works
createUser(rawInput);           // ❌ Type error - must validate first!

// ✅ Log levels - cannot use strings
logger.log(LogLevel.INFO, 'message');    // ✅ Works
logger.log('info', 'message');           // ❌ Type error
```

## Exported Types

### Branded IDs
- `UserId`, `PostId`, `CommentId`, `OrderId`, `ProductId`

### Validation State
- `Validated<T>` - Phantom type for validated data
- `Unvalidated<T>` - Unvalidated data

### Log Levels
- `LogLevel` - Branded enum for log levels

### Primitives
- `Email` - Validated email string
- `Url` - Validated URL string
- `NonEmptyString` - Cannot be empty
- `PositiveNumber` - Must be positive

### File Paths
- `RouterPath` - Must match `*.router` pattern
- `SchemaPath` - Must match `*.schema` pattern
- `ServicePath` - Must match `*.service` pattern
- `EntityPath` - Must match `*.entity` pattern

### Pagination
- `CursorPaginationInput` / `CursorPaginatedResponse<T>`
- `OffsetPaginationInput` / `OffsetPaginatedResponse<T>`

### API Responses
- `ApiResponse<T>` - Standard response format
- `Result<T, E>` - Internal result type

## Rules

❌ **DO NOT** create new branded types outside this package
❌ **DO NOT** use primitive types where branded types exist
✅ **DO** import from `@app/types`
✅ **DO** use branded types for all IDs, emails, URLs
