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
  },
  {
    pattern: /import.*winston|import.*pino|import.*bunyan/,
    message: 'DO NOT import logging libraries - use: import { logger } from "@/lib/logger"',
  },
  {
    pattern: /console\.(log|info|warn|error|debug)/,
    message: 'DO NOT use console.* - use: import { logger } from "@/lib/logger"',
    exclude: ['src/lib/logger.ts', '*.test.ts'],
  },
  {
    pattern: /class.*Error extends Error/,
    message: 'DO NOT create custom error classes - use: import { TRPCError } from "@/server/api/trpc"',
    exclude: ['src/lib/'],
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
