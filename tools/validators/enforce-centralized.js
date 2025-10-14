#!/usr/bin/env node

/**
 * Enforce centralized patterns - Simple validator
 * Prevents AI from creating duplicate implementations
 */

const fs = require('fs');
const { execSync } = require('child_process');

function getStagedFiles() {
  try {
    return execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' })
      .split('\n')
      .filter((f) => f.match(/\.(ts|tsx|js|jsx)$/))
      .filter(Boolean);
  } catch {
    return [];
  }
}

const RULES = [
  {
    pattern: /new PrismaClient\(/,
    message: 'DO NOT create new PrismaClient() - use: import { db } from "@/lib/db"',
    exclude: ['src/lib/db.ts'],
  },
  {
    pattern: /import.*winston|import.*pino|import.*bunyan/,
    message: 'DO NOT import logging libraries - use port: import type { ILogger } from "@/core/ports/logger.port"',
  },
  {
    pattern: /console\.(log|info|warn|error|debug)/,
    message: 'DO NOT use console.* in business logic - use ILogger port',
    exclude: ['src/infrastructure/logger/', '*.test.ts', 'tools/'],
  },
  {
    pattern: /class.*Error extends Error/,
    message: 'DO NOT create custom error classes outside core - use domain errors in @/core/ports/',
    exclude: ['src/lib/errors.ts', 'src/core/'],
  },
  {
    pattern: /import.*@prisma\/client/,
    message: 'DO NOT import Prisma in core/ - implement IRepository adapter in infrastructure/',
    exclude: ['src/infrastructure/db/', 'src/lib/db.ts', 'prisma/'],
  },
  {
    pattern: /import.*@trpc\/server/,
    message: 'DO NOT import tRPC in core/ - use adapters in infrastructure/api/',
    exclude: ['src/infrastructure/api/', 'src/server/api/'],
  },
];

const files = getStagedFiles();
const violations = [];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf-8');

    for (const rule of RULES) {
      // Check exclusions
      if (rule.exclude?.some((pattern) => file.includes(pattern))) continue;

      if (rule.pattern.test(content)) {
        violations.push({ file, message: rule.message });
      }
    }
  } catch {
    continue;
  }
}

if (violations.length > 0) {
  console.error('\n❌ CENTRALIZED PATTERN VIOLATIONS\n');
  violations.forEach(({ file, message }) => {
    console.error(`  ${file}`);
    console.error(`  → ${message}\n`);
  });
  console.error('Use existing implementations in src/lib/\n');
  process.exit(1);
}

console.log('✅ Centralized patterns enforced');
