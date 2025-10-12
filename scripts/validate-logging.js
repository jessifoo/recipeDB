#!/usr/bin/env node

/**
 * Pre-commit hook to prevent logging chaos
 * Scans for violations of centralized logging rules
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VIOLATIONS = {
  CONSOLE_USAGE: [],
  LOGGING_FILES: [],
  EXTERNAL_LOGGERS: [],
};

const FORBIDDEN_PATTERNS = [
  // Console methods
  /console\.(log|info|warn|error|debug|trace)/g,
  
  // Common logging library patterns
  /import.*from ['"]winston['"]/g,
  /import.*from ['"]pino['"]/g,
  /import.*from ['"]bunyan['"]/g,
  /import.*from ['"]log4js['"]/g,
];

const FORBIDDEN_FILENAMES = [
  'log.ts', 'log.js',
  'logger.ts', 'logger.js',
  'logging.ts', 'logging.js',
  'log-util.ts', 'log-utils.ts',
  'logger-util.ts', 'logger-utils.ts',
];

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    });
    return output.trim().split('\n').filter(f => f.match(/\.(ts|tsx|js|jsx)$/));
  } catch (e) {
    // If not in git or no staged files
    return [];
  }
}

function checkFile(filePath) {
  // Skip the logger package itself
  if (filePath.includes('packages/logger/')) {
    return;
  }

  // Skip node_modules, dist, etc.
  if (filePath.includes('node_modules') || filePath.includes('dist') || filePath.includes('.next')) {
    return;
  }

  // Check for forbidden filenames
  const basename = path.basename(filePath);
  if (FORBIDDEN_FILENAMES.includes(basename)) {
    VIOLATIONS.LOGGING_FILES.push({
      file: filePath,
      reason: `Forbidden filename: ${basename}. Use @recipedb/logger instead.`,
    });
  }

  // Read file content
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return; // File doesn't exist or can't be read
  }

  // Check for console usage
  const consoleMatches = content.match(/console\.(log|info|warn|error|debug|trace)/g);
  if (consoleMatches) {
    VIOLATIONS.CONSOLE_USAGE.push({
      file: filePath,
      matches: [...new Set(consoleMatches)],
    });
  }

  // Check for external logging libraries
  FORBIDDEN_PATTERNS.slice(1).forEach(pattern => {
    if (pattern.test(content)) {
      VIOLATIONS.EXTERNAL_LOGGERS.push({
        file: filePath,
        pattern: pattern.toString(),
      });
    }
  });
}

function printViolations() {
  let hasViolations = false;

  console.log('\n🔍 LOGGING VALIDATION REPORT\n');

  if (VIOLATIONS.CONSOLE_USAGE.length > 0) {
    hasViolations = true;
    console.error('❌ CONSOLE USAGE DETECTED (use @recipedb/logger instead):');
    VIOLATIONS.CONSOLE_USAGE.forEach(({ file, matches }) => {
      console.error(`   ${file}`);
      matches.forEach(match => console.error(`     - ${match}`));
    });
    console.error('\n   Fix: import { logger } from "@recipedb/logger"\n');
  }

  if (VIOLATIONS.LOGGING_FILES.length > 0) {
    hasViolations = true;
    console.error('❌ FORBIDDEN LOGGING FILES DETECTED:');
    VIOLATIONS.LOGGING_FILES.forEach(({ file, reason }) => {
      console.error(`   ${file}: ${reason}`);
    });
    console.error('\n   Fix: Delete these files and use @recipedb/logger\n');
  }

  if (VIOLATIONS.EXTERNAL_LOGGERS.length > 0) {
    hasViolations = true;
    console.error('❌ EXTERNAL LOGGING LIBRARIES DETECTED:');
    VIOLATIONS.EXTERNAL_LOGGERS.forEach(({ file }) => {
      console.error(`   ${file}`);
    });
    console.error('\n   Fix: Remove external logger imports, use @recipedb/logger\n');
  }

  if (!hasViolations) {
    console.log('✅ No logging violations detected\n');
  }

  return hasViolations;
}

// Main execution
const stagedFiles = getStagedFiles();

if (stagedFiles.length === 0) {
  console.log('No staged files to check');
  process.exit(0);
}

console.log(`Checking ${stagedFiles.length} staged file(s) for logging violations...`);

stagedFiles.forEach(checkFile);

if (printViolations()) {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('COMMIT BLOCKED: Fix logging violations before committing');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}

process.exit(0);
