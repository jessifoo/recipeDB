#!/usr/bin/env node

/**
 * No Package.json Validator
 * CRITICAL: Prevents package.json creation in packages/
 * This would bypass centralized dependency management
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all package.json files
const packageJsonFiles = glob.sync('packages/**/package.json', {
  ignore: ['**/node_modules/**'],
});

if (packageJsonFiles.length > 0) {
  console.error('\n❌ CRITICAL: PACKAGE.JSON FILES FOUND IN PACKAGES/\n');
  console.error('This DEFEATS centralized dependency management!\n');
  console.error('Found package.json in:');
  packageJsonFiles.forEach((file) => {
    console.error(`  - ${file}`);
  });
  console.error('\n⚠️  THERE MUST BE ONLY ONE package.json AT ROOT\n');
  console.error('Why this matters:');
  console.error('  - Prevents adding dependencies outside root package.json');
  console.error('  - Enforces centralized package management');
  console.error('  - Makes package validator effective');
  console.error('\nFix:');
  console.error('  1. Delete all package.json files in packages/');
  console.error('  2. Add dependencies to root package.json only');
  console.error('  3. Use TypeScript path mapping for imports\n');

  process.exit(1);
}

console.log('✅ No package.json in packages/ (correct!)');
