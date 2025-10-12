# @app/database

**SINGLE DATABASE CLIENT - DO NOT CREATE PRISMA INSTANCES**

## Usage

```typescript
import { db } from '@app/database';

// ✅ Use the singleton
const users = await db.user.findMany();

// ✅ Pagination helpers
import { cursorPaginate, offsetPaginate } from '@app/database';

const result = await cursorPaginate('user', {
  limit: 20,
  where: { active: true },
});
```

## Rules

### ⛔ FORBIDDEN

```typescript
// ❌ DO NOT create Prisma instances
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

// ❌ DO NOT import PrismaClient
import { PrismaClient } from '@prisma/client';
```

### ✅ REQUIRED

```typescript
// ✅ Import the singleton
import { db } from '@app/database';

// ✅ Use it directly
const result = await db.user.findMany();
```

## Features

- **Singleton pattern**: One connection pool
- **Auto-logging**: Queries logged in development
- **Pagination helpers**: Cursor & offset pagination
- **Type-safe**: Full TypeScript support
- **Hot reload**: Works in development

## Pagination

### Cursor-based (Infinite Scroll)

```typescript
import { cursorPaginate } from '@app/database';

const result = await cursorPaginate('user', {
  cursor: lastUserId,
  limit: 20,
  where: { active: true },
  orderBy: { createdAt: 'desc' },
});

console.log(result.data);        // Users
console.log(result.nextCursor);  // Next cursor
console.log(result.hasMore);     // Has more data?
```

### Offset-based (Page Numbers)

```typescript
import { offsetPaginate } from '@app/database';

const result = await offsetPaginate('user', {
  page: 1,
  limit: 20,
  where: { active: true },
});

console.log(result.data);                  // Users
console.log(result.pagination.total);      // Total count
console.log(result.pagination.totalPages); // Total pages
```

## Migrations

```bash
# Create migration
npx prisma migrate dev --name add_user_model

# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate

# Reset database (development only!)
npx prisma migrate reset
```

## Schema Location

`packages/database/prisma/schema.prisma`

Edit this file to add/modify models.
