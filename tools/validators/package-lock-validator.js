#!/usr/bin/env node

/**
 * Package Lock Validator
 * Prevents adding unapproved or banned dependencies
 * Enforces centralized implementations
 */

const fs = require('fs');
const { execSync } = require('child_process');

// Banned packages with reason
const BANNED_DEPENDENCIES = {
  // Logging (use @app/logger)
  winston: 'Use @app/logger instead',
  pino: 'Use @app/logger instead',
  bunyan: 'Use @app/logger instead',
  'log4js': 'Use @app/logger instead',
  loglevel: 'Use @app/logger instead',
  consola: 'Use @app/logger instead',

  // HTTP clients (use tRPC or native fetch)
  axios: 'Use tRPC for API calls',
  got: 'Use tRPC or native fetch',
  'node-fetch': 'Use native fetch (Node 18+)',
  superagent: 'Use tRPC or native fetch',

  // ORMs (use Prisma via @app/database)
  typeorm: 'Use @app/database (Prisma)',
  sequelize: 'Use @app/database (Prisma)',
  'drizzle-orm': 'Use @app/database (Prisma)',
  mongoose: 'Use @app/database (Prisma)',

  // Validation (use Zod via @app/validation)
  yup: 'Use @app/validation (Zod schemas)',
  joi: 'Use @app/validation (Zod schemas)',
  'class-validator': 'Use @app/validation (Zod schemas)',

  // State management (Zustand is approved)
  '@reduxjs/toolkit': 'Use Zustand for client state',
  'react-redux': 'Use Zustand for client state',
  mobx: 'Use Zustand for client state',
  recoil: 'Use Zustand for client state',
  jotai: 'Use Zustand for client state',

  // Linting/Formatting (use Biome)
  eslint: 'Use Biome instead',
  prettier: 'Use Biome instead',
};

// Approved dependencies (whitelist)
const APPROVED_DEPENDENCIES = {
  // Core
  react: true,
  'react-dom': true,
  next: true,

  // tRPC
  '@trpc/server': true,
  '@trpc/client': true,
  '@trpc/react-query': true,
  '@trpc/next': true,

  // React Query
  '@tanstack/react-query': true,

  // Database
  prisma: true,
  '@prisma/client': true, // Only via @app/database

  // Validation (only via @app/validation)
  zod: true,

  // Auth
  'next-auth': true,
  '@auth/prisma-adapter': true,
  '@auth/core': true,

  // State
  '@reduxjs/toolkit': true,
  'react-redux': true,
  zustand: true,

  // Utilities
  superjson: true,
  '@t3-oss/env-nextjs': true,

  // UI
  tailwindcss: true,
  '@tailwindcss/forms': true,
  '@tailwindcss/typography': true,

  // Tooling
  typescript: true,
  '@types/node': true,
  '@types/react': true,
  '@types/react-dom': true,

  // Testing
  vitest: true,
  '@vitest/coverage-v8': true,
  '@testing-library/react': true,
  '@testing-library/jest-dom': true,
  '@playwright/test': true,
  msw: true,
  'type-coverage': true,

  // Build tools
  '@nx/next': true,
  '@nx/react': true,
  '@nx/jest': true,
  '@nx/playwright': true,
  '@nx/js': true,
  '@nx/devkit': true,
  nx: true,

  // Formatting/Linting
  '@biomejs/biome': true,
  
  // Git hooks
  husky: true,
  
  // Utilities for validators
  glob: true,
  minimatch: true,

  // Our internal packages (folders only - NO package.json!)
  '@app/logger': true,
  '@app/database': true,
  '@app/validation': true,
  '@app/errors': true,
  '@app/config': true,
  '@app/types': true,
};

function getPackageJsonChanges() {
  try {
    const diff = execSync('git diff --cached package.json', {
      encoding: 'utf-8',
    });

    const additions = diff
      .split('\n')
      .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
      .map((line) => line.slice(1).trim())
      .filter((line) => line.startsWith('"'))
      .map((line) => {
        const match = line.match(/"([^"]+)":/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    return additions;
  } catch (e) {
    return [];
  }
}

// Main execution
const newDeps = getPackageJsonChanges();
const violations = [];

for (const dep of newDeps) {
  // Check if banned
  if (BANNED_DEPENDENCIES[dep]) {
    violations.push({
      package: dep,
      reason: BANNED_DEPENDENCIES[dep],
      severity: 'error',
    });
  }
  // Check if needs approval
  else if (!APPROVED_DEPENDENCIES[dep]) {
    violations.push({
      package: dep,
      reason: 'Not in approved dependency list. Request approval first.',
      severity: 'warning',
    });
  }
}

if (violations.length > 0) {
  const errors = violations.filter((v) => v.severity === 'error');
  const warnings = violations.filter((v) => v.severity === 'warning');

  if (errors.length > 0) {
    console.error('\n❌ BANNED PACKAGES DETECTED\n');
    errors.forEach(({ package: pkg, reason }) => {
      console.error(`  ❌ ${pkg}`);
      console.error(`     ${reason}\n`);
    });
  }

  if (warnings.length > 0) {
    console.error('⚠️  UNAPPROVED PACKAGES\n');
    warnings.forEach(({ package: pkg, reason }) => {
      console.error(`  ⚠️  ${pkg}`);
      console.error(`     ${reason}\n`);
    });
    console.error('To approve:');
    console.error(
      '  1. Add to APPROVED_DEPENDENCIES in tools/validators/package-lock-validator.js'
    );
    console.error('  2. Document why in docs/dependencies.md\n');
  }

  if (errors.length > 0) {
    process.exit(1);
  }
}

console.log('✅ Package validation passed');
