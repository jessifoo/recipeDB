# Using This Template for New Projects

## 🎯 This is a Reusable Template

**Use this foundation to start ANY project with maximum enforcement already built-in.**

---

## 🚀 Starting a New Project

### Method 1: GitHub Template (Recommended)

1. **Make this a template repo:**
   ```bash
   # On GitHub:
   Settings → Check "Template repository"
   ```

2. **Start new project:**
   ```bash
   # Click "Use this template" button on GitHub
   # Or via CLI:
   gh repo create my-new-project --template yourname/template-repo
   ```

3. **Customize:**
   ```bash
   cd my-new-project
   
   # Update package.json name
   # Update README.md
   # Setup your database
   # Start building!
   ```

---

### Method 2: Use Create Script (Fast!)

```bash
# In the template directory
./create-project.sh my-new-project

# Follow the prompts, then:
cd ../my-new-project
pnpm install
pnpm run prepare
cp packages/config/.env.example .env
# Edit .env with your values
pnpm dev
```

### Method 3: Manual Clone & Customize

```bash
# Clone template
git clone https://github.com/yourname/template-repo my-new-project
cd my-new-project

# Remove git history (start fresh)
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"

# Update project name
# Edit package.json: "name": "@app/my-new-project"
# Edit README.md with your project details

# Install & setup
pnpm install
pnpm run prepare
cp packages/config/.env.example .env
# Edit .env with your values

# You're ready!
pnpm dev
```

---

## 📋 What's Included (Generic)

**Enforcement (works for any project):**
- ✅ TypeScript strict mode
- ✅ 12 pre-commit validators
- ✅ Biome linting
- ✅ Package lockdown
- ✅ Import blocking

**Core packages (generic):**
- ✅ `@app/types` - Branded types
- ✅ `@app/logger` - Logging
- ✅ `@app/database` - Prisma client
- ✅ `@app/errors` - Errors
- ✅ `@app/validation` - Validation
- ✅ `@app/config` - Config

**Ready for Phase 3:**
- [ ] Auth (when you need it)
- [ ] State management (when you need it)
- [ ] tRPC (when you need it)
- [ ] Generators (when you need it)

---

## 🎯 Use Cases

### Recipe Database
```bash
git clone template my-recipe-db
cd my-recipe-db
# Add: Recipe models, ingredient tracking, meal planning
```

### E-commerce Site
```bash
git clone template my-shop
cd my-shop
# Add: Product catalog, cart, checkout
```

### SaaS Application
```bash
git clone template my-saas
cd my-saas
# Add: Tenant management, billing, dashboards
```

### Internal Tool
```bash
git clone template internal-tool
cd internal-tool
# Add: Your specific business logic
```

**Every project starts with the same solid foundation.**

---

## ✨ What Makes This Template Special

1. **AI-Proof** - Enforces quality automatically
2. **Zero Config** - Ready to go
3. **Battle-Tested** - Best practices built-in
4. **Modular** - Easy to extend
5. **Type-Safe** - End-to-end types
6. **Fast** - Optimized for speed

---

## 📝 Customization Checklist

When starting a new project from this template:

```bash
# 1. Update package.json
- [ ] Change "name" to your project
- [ ] Update "author"
- [ ] Update "description"

# 2. Update README.md
- [ ] Project-specific description
- [ ] Your use cases
- [ ] Your deployment info

# 3. Setup environment
- [ ] Copy .env.example to .env
- [ ] Fill in DATABASE_URL
- [ ] Fill in NEXTAUTH_SECRET
- [ ] Fill in app-specific vars

# 4. Database schema
- [ ] Update packages/database/prisma/schema.prisma
- [ ] Add your models
- [ ] Run: pnpm db:migrate

# 5. Start building!
- [ ] Add your domain logic (packages/domain/*)
- [ ] Add your API routes (packages/api/*)
- [ ] Add your UI (apps/web/*)
```

---

## 🚫 What NOT to Change

**Keep these as-is (enforcement layer):**
- ❌ Don't modify validators
- ❌ Don't modify tsconfig.base.json strict settings
- ❌ Don't modify biome.json
- ❌ Don't modify .husky/pre-commit
- ❌ Don't create package.json in packages/

**Why?** These are your guardrails. They prevent chaos.

---

## 💡 Template Maintenance

**Keep template updated:**
```bash
# In your template repo
git pull template main
git merge template/main
```

**Share improvements:**
- Fix found in one project? Update template!
- New validator? Add to template!
- Better pattern? Update template!

---

## 🎯 The Goal

**One template → Infinite projects**

Every project you start has:
- ✅ Maximum enforcement
- ✅ Best practices
- ✅ Zero setup time
- ✅ Consistent architecture

**Build features, not infrastructure.**
