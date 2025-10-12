#!/usr/bin/env node

/**
 * Import Validator
 * Checks for banned import patterns
 * Enforces centralized systems
 */

const fs = require('fs');
const { execSync } = require('child_process');

const BANNED_IMPORTS = [
  {
    pattern: /from ['"]@prisma\/client['"]/g,
    message: 'Direct Prisma imports banned - use @app/database instead',
  },
  {
    pattern: /from ['"]winston['"]/g,
    message: 'Winston banned - use @app/logger instead',
  },
  {
    pattern: /from ['"]pino['"]/g,
    message: 'Pino banned - use @app/logger instead',
  },
  {
    pattern: /from ['"]axios['"]/g,
    message: 'Axios banned - use tRPC instead',
  },
  {
    pattern: /from ['"]zod['"]/g,
    message: 'Direct Zod imports banned - use @app/validation schemas instead',
  },
];

const BANNED_PATTERNS = [
  {
    pattern: /console\.(log|error|warn|debug|info)/g,
    message: 'console.* banned - use @app/logger instead',
    exclude: ['*.test.ts', '*.spec.ts'], // Allow in tests
  },
  {
    pattern: /new PrismaClient\(/g,
    message: 'new PrismaClient() banned - use db from @app/database',
  },
];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    });
    return output
      .trim()
      .split('\n')
      .filter((f) => f.match(/\.(ts|tsx)$/) && !f.includes('node_modules'));
  } catch (e) {
    return [];
  }
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const violations = [];

  // Check banned imports
  for (const { pattern, message } of BANNED_IMPORTS) {
    if (pattern.test(content)) {
      violations.push({ line: 'import', message });
    }
  }

  // Check banned patterns
  for (const { pattern, message, exclude } of BANNED_PATTERNS) {
    // Check if file is excluded
    if (exclude && exclude.some((ex) => filePath.includes(ex))) {
      continue;
    }

    if (pattern.test(content)) {
      violations.push({ line: 'code', message });
    }
  }

  return violations;
}

// Main execution
const stagedFiles = getStagedFiles();

if (stagedFiles.length === 0) {
  process.exit(0);
}

const allViolations = [];

for (const file of stagedFiles) {
  try {
    const violations = validateFile(file);
    if (violations.length > 0) {
      allViolations.push({ file, violations });
    }
  } catch (e) {
    // File doesn't exist or can't be read
    continue;
  }
}

if (allViolations.length > 0) {
  console.error('\n❌ IMPORT VIOLATIONS DETECTED\n');

  allViolations.forEach(({ file, violations }) => {
    console.error(`  ${file}`);
    violations.forEach(({ message }) => {
      console.error(`    → ${message}`);
    });
    console.error('');
  });

  process.exit(1);
}

console.log('✅ Import validation passed');
