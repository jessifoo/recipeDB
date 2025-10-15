# 🚀 Generator System - Complete Code Generation

## 🎯 The Problem This Solves

**AI writes incomplete code:**
- Missing tests
- No error handling
- Inconsistent patterns
- Partial implementations

**Solution:** Generators that create **COMPLETE, PRODUCTION-READY features**

---

## ✅ What Generators Create

**One command generates:**
1. ✅ Domain layer (service + repository)
2. ✅ API layer (tRPC router)
3. ✅ Validation schemas (Zod)
4. ✅ Unit tests (mocked)
5. ✅ Integration tests (real DB)
6. ✅ All with proper error handling
7. ✅ All with proper types
8. ✅ All with file markers

**Complete feature in seconds, not hours.**

---

## 🔧 Usage

### Generate Complete Feature

```bash
pnpm generate:feature user \
  --fields "name:string,email:email,age:number" \
  --ops create,get,list,update,delete
```

**This creates:**

```
packages/domain/user/src/
  ├── user.service.ts              ← Business logic
  ├── user.repository.ts           ← Data access
  ├── user.service.test.ts         ← Unit tests (mocked)
  └── user.integration.test.ts     ← Integration tests (real DB)

packages/api/src/routers/
  └── user.router.ts               ← tRPC endpoints

packages/validation/src/schemas/
  └── user.schema.ts               ← Validation schemas
```

---

## 📋 Generated Code Quality

### 1. **Service Layer** (Complete)
```typescript
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(data: Validated<CreateUserInput>): Promise<User> {
    logger.info('Creating user', { data });

    const result = await catchAsync(() => this.repository.create(data));

    if (!result.success) {
      throw new DatabaseError('Failed to create user', { cause: result.error });
    }

    logger.info('User created', { id: result.data.id });
    return result.data;
  }

  // All operations: get, list, update, delete
  // All with error handling
  // All with logging
  // All properly typed
}
```

### 2. **tRPC Router** (Complete)
```typescript
export const userRouter = router({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      try {
        const validated = validate(createUserSchema, input);
        return await service.create(validated);
      } catch (error) {
        throw handleTrpcError(error);  // Centralized error handling
      }
    }),
  // All endpoints with error handling
});
```

### 3. **Unit Tests** (Complete - Mocked)
```typescript
describe('UserService', () => {
  let service: UserService;
  let mockRepository: UserRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      // All methods mocked
    };
    service = new UserService(mockRepository);
  });

  it('should create user successfully', async () => {
    // Full test implementation
  });

  it('should throw DatabaseError on repository failure', async () => {
    // Error case tested
  });
});
```

### 4. **Integration Tests** (Complete - Real DB)
```typescript
describe('User Integration', () => {
  it('should create and retrieve user', async () => {
    const created = await service.create(input);
    const retrieved = await service.getById(created.id);
    expect(retrieved).toEqual(created);
  });

  // Full integration tests with real DB
});
```

---

## 🎯 Enforced Quality

**Every generated file has:**
- ✅ File marker (proves it's generated)
- ✅ Proper imports (only from @app/*)
- ✅ Error handling (centralized via @app/errors)
- ✅ Logging (via @app/logger)
- ✅ Type safety (explicit return types)
- ✅ Validation (via @app/validation)
- ✅ Tests (both unit and integration)

**AI cannot generate incomplete code - the generator does it all.**

---

## 🚫 What AI CANNOT Do Anymore

```typescript
// ❌ AI tries to manually create service
export function createUser(data: any) {
  // TODO: add validation
  // TODO: add error handling
  return db.user.create(data);
}

// Result: File marker validator BLOCKS this
// Message: "Must use generator: pnpm generate:feature user"
```

**Validators enforce generator usage for:**
- `packages/domain/*` - All domain logic
- `packages/api/*` - All API routes
- `apps/*` - All app code

---

## 📊 Field Types Supported

```typescript
--fields "
  name:string,           // z.string()
  email:email,           // common.email
  age:number,            // z.number()
  isActive:boolean,      // z.boolean()
  website:url,           // common.url
  birthDate:date         // z.date()
"
```

---

## 🎮 Operations Supported

```bash
--ops create,get,list,update,delete
```

**Each operation generates:**
- Service method (with error handling)
- Repository method (data access)
- tRPC endpoint (with validation)
- Unit tests (mocked)
- Integration tests (real DB)

---

## 🔥 Example: Generate Recipe Feature

```bash
pnpm generate:feature recipe \
  --fields "title:string,description:string,ingredients:string,instructions:string,cookTime:number" \
  --ops create,get,list,update,delete
```

**Creates complete recipe CRUD with:**
- Recipe service (all methods)
- Recipe repository (all methods)
- Recipe router (all endpoints)
- Recipe schemas (create, update)
- Recipe tests (unit + integration)

**Then:**
1. Add `Recipe` model to `schema.prisma`
2. Run `pnpm db:migrate`
3. Done! Full feature ready.

---

## 🎯 Generator Benefits

### For AI:
- ✅ Cannot write incomplete code
- ✅ Guided to correct patterns
- ✅ All quality enforced automatically

### For Developers:
- ✅ Instant complete features
- ✅ Consistent architecture
- ✅ Production-ready code
- ✅ Tests included
- ✅ No boilerplate

### For Project:
- ✅ Maintainable codebase
- ✅ Consistent patterns
- ✅ High test coverage
- ✅ Type-safe end-to-end

---

## 🚀 Next Steps

1. **Generate a feature:**
   ```bash
   pnpm generate:feature myfeature --fields "name:string" --ops create,get,list
   ```

2. **Update schema:**
   ```prisma
   model MyFeature {
     id        String   @id @default(cuid())
     name      String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

3. **Migrate:**
   ```bash
   pnpm db:migrate
   ```

4. **Test:**
   ```bash
   pnpm test
   ```

**Complete feature in 5 minutes.** 🎯
