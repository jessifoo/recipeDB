# Quality Enforcement - Forces Complete Code

## 🎯 Goal: AI Cannot Ship Incomplete Code

**12 validators enforce quality and completeness.**

---

## 🚫 What AI Cannot Commit

### 1. Incomplete Code (Validator #1)
```typescript
// ❌ BLOCKED
function createUser() {
  // TODO: implement validation
  // FIXME: add error handling
}

// ❌ BLOCKED
it.only('should work', () => { ... });  // Must run all tests
it.skip('should work', () => { ... });  // Must run all tests

// ❌ BLOCKED
try {
  await db.user.create(data);
} catch (error) {
  // Empty catch - must handle errors!
}

// ✅ ALLOWED
function createUser(data: Validated<UserInput>): Promise<UserId> {
  try {
    const user = await db.user.create(data);
    return UserId(user.id);
  } catch (error) {
    logger.error('Failed to create user', error);
    throw new DatabaseError('Failed to create user', { cause: error });
  }
}
```

**Enforced by:** Code quality validator

---

### 2. Type Unsafe Code (Validator #2)
```typescript
// ❌ BLOCKED - explicit 'any'
function process(data: any) { ... }
const result: any = getValue();
const items: any[] = getItems();

// ✅ ALLOWED - proper types
function process(data: unknown) {
  if (typeof data === 'string') {
    // Narrow type with guard
  }
}

const result: UserData = getValue();
const items: User[] = getItems();
```

**Enforced by:** Type coverage validator

---

### 3. Missing Return Types (Validator #1)
```typescript
// ❌ BLOCKED - no return type on exported function
export function getUser(id: UserId) {
  return db.user.findUnique({ where: { id } });
}

// ✅ ALLOWED - explicit return type
export function getUser(id: UserId): Promise<User | null> {
  return db.user.findUnique({ where: { id } });
}

// ✅ ALLOWED - inferred on private functions is OK
function helperFunction(x: number) {
  return x * 2;  // Not exported, return type can be inferred
}
```

**Enforced by:** Code quality validator

---

### 4. Commented Out Code (Validator #1)
```typescript
// ❌ BLOCKED
// import { oldFunction } from './old';
// const result = oldFunction();

// ✅ ALLOWED - real comments are fine
// This function creates a user with validation
function createUser() { ... }
```

**Enforced by:** Code quality validator

---

### 5. Complex Functions (Validator #8 - Warning)
```typescript
// ⚠️ WARNING - function too long (>50 lines)
// ⚠️ WARNING - too many parameters (>5)
// ⚠️ WARNING - too deeply nested (>3 levels)

function complexFunction(
  a: string,
  b: number,
  c: boolean,
  d: object,
  e: string,
  f: number  // 6 parameters!
) {
  if (a) {
    if (b > 0) {
      if (c) {
        if (d) {  // 4 levels of nesting!
          // ...
        }
      }
    }
  }
}

// ✅ BETTER - refactored
function simpleFunction(params: FunctionParams) {
  // Early returns reduce nesting
  if (!params.isValid) return;
  
  // Extract to helper functions
  processData(params);
}
```

**Enforced by:** Function complexity validator (warning only)

---

### 6. Missing Tests (Validator #9 - Warning)
```
⚠️ WARNING
  packages/domain/user/src/user.service.ts
  Expected: packages/domain/user/src/user.service.test.ts
```

**Enforced by:** Test coverage validator (warning for now, error in Phase 3)

---

## 📊 Validation Matrix

| Issue | Severity | Blocks Commit? | Validator |
|-------|----------|----------------|-----------|
| TODO/FIXME comments | ERROR | ✅ Yes | #1 Code Quality |
| .only/.skip in tests | ERROR | ✅ Yes | #1 Code Quality |
| Empty catch blocks | ERROR | ✅ Yes | #1 Code Quality |
| Commented code | WARNING | ❌ No | #1 Code Quality |
| Explicit 'any' types | ERROR | ✅ Yes | #2 Type Coverage |
| Missing return types | ERROR | ✅ Yes | #1 Code Quality |
| console.log usage | ERROR | ✅ Yes | #1 Code Quality |
| Function >50 lines | WARNING | ❌ No | #8 Complexity |
| >5 parameters | WARNING | ❌ No | #8 Complexity |
| >3 nesting levels | WARNING | ❌ No | #8 Complexity |
| Missing tests | WARNING | ❌ No | #9 Test Coverage |

---

## 🎯 The Result

**Code that commits is:**
- ✅ Complete (no TODOs)
- ✅ Type-safe (no 'any')
- ✅ Tested (all tests run)
- ✅ Error-handled (no empty catch)
- ✅ Explicit (return types declared)
- ✅ Clean (no dead code)

**AI cannot ship half-finished work.**

---

## 🔧 Commands

```bash
# Run quality checks manually
npm run quality

# Check type coverage
npm run type-coverage

# Check test coverage
npm run test:coverage

# Run all validations
npm run validate
```

---

## 💡 Tips for AI

**To pass validators:**
1. Don't leave TODOs - implement or create GitHub issue
2. Always handle errors explicitly
3. Always declare return types on exports
4. Use proper types, not 'any'
5. Write tests alongside code
6. Keep functions small and focused
7. Run all tests (no .only or .skip)

**The validators guide you to complete, production-ready code.**
