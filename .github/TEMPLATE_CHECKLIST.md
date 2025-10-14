# ✅ New Project Checklist

When using this template for a new project:

## 1. Repository Setup

- [ ] Click "Use this template" on GitHub
- [ ] Name your new repository
- [ ] Clone locally

## 2. Customize Package

```bash
# Update package.json
- [ ] Change "name" to "@app/your-project-name"
- [ ] Update "description"
- [ ] Update "author"
```

## 3. Environment Setup

```bash
# Setup environment
- [ ] Copy .env.example to .env
- [ ] Update DATABASE_URL
- [ ] Generate NEXTAUTH_SECRET (npx auth secret)
- [ ] Update NEXT_PUBLIC_APP_URL
```

## 4. Database Schema

```bash
# Update schema
- [ ] Edit packages/database/prisma/schema.prisma
- [ ] Add your models
- [ ] Run: pnpm db:migrate
```

## 5. Install & Validate

```bash
- [ ] pnpm install
- [ ] pnpm run prepare
- [ ] pnpm run validate
```

## 6. Customize README

```bash
# Update README.md
- [ ] Project-specific description
- [ ] Your features
- [ ] Your deployment steps
```

## 7. Start Building!

```bash
- [ ] pnpm dev
- [ ] Start adding your features
```

---

## 🚫 DO NOT MODIFY

These are your guardrails (keep as-is):

- ❌ `tools/validators/` - Enforcement layer
- ❌ `tsconfig.base.json` - TypeScript strict config
- ❌ `biome.json` - Linting config
- ❌ `.husky/pre-commit` - Git hooks
- ❌ Core packages (`@app/types`, `@app/logger`, etc.)

---

## ✅ You're Ready!

Once checklist is complete, delete this file and start coding!
