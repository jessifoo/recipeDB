#!/usr/bin/env node

/**
 * Test Coverage Validator
 * Ensures all new code has tests
 */

const fs = require('fs');
const { execSync } = require('child_process');

function getStagedFiles() {
  try {
    const files = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    })
      .split('\n')
      .filter(Boolean);
    return files;
  } catch (e) {
    return [];
  }
}

const REQUIRES_TESTS = [
  /packages\/.*\/src\/.*\.(ts|tsx)$/,  // All package source files
  /apps\/.*\/src\/.*\.(ts|tsx)$/,      // All app source files
];

const EXCLUDED_FROM_TESTS = [
  /\.test\.(ts|tsx)$/,
  /\.spec\.(ts|tsx)$/,
  /index\.ts$/,                // Index files (just exports)
  /types\.ts$/,                // Type definition files
  /constants\.ts$/,            // Constants files
  /config\/.*\.ts$/,           // Config files
  /\.stories\.(ts|tsx)$/,      // Storybook files
];

const files = getStagedFiles();
const violations = [];

for (const file of files) {
  // Check if file requires tests
  const requiresTest = REQUIRES_TESTS.some((pattern) => pattern.test(file));
  if (!requiresTest) continue;
  
  // Check if file is excluded
  const isExcluded = EXCLUDED_FROM_TESTS.some((pattern) => pattern.test(file));
  if (isExcluded) continue;
  
  // Check if test file exists
  const testFile = file
    .replace(/\.(ts|tsx)$/, '.test.$1')
    .replace('/src/', '/src/');
  
  const specFile = file
    .replace(/\.(ts|tsx)$/, '.spec.$1')
    .replace('/src/', '/src/');
  
  const hasTest = fs.existsSync(testFile) || fs.existsSync(specFile);
  
  if (!hasTest) {
    violations.push({
      file,
      expectedTest: testFile,
    });
  }
}

if (violations.length > 0) {
  console.error('\n⚠️  MISSING TESTS\n');
  console.error('The following files need tests:\n');
  
  violations.forEach(({ file, expectedTest }) => {
    console.error(`  ⚠️  ${file}`);
    console.error(`     Expected: ${expectedTest}\n`);
  });
  
  console.error('Why this matters:');
  console.error('  - All business logic must be tested');
  console.error('  - Tests document expected behavior');
  console.error('  - Prevents regressions\n');
  console.error('To fix:');
  console.error('  - Create test file alongside source file');
  console.error('  - Use generators (Phase 3) to create files with tests\n');
  
  // Warning only for now, will become error in Phase 3
  console.error('⚠️  This is a WARNING for now. Will be ERROR in Phase 3.\n');
  process.exit(0);
}

console.log('✅ All files have corresponding tests');
