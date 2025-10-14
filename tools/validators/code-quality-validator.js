#!/usr/bin/env node

/**
 * Code Quality Validator
 * Enforces complete, production-ready code
 * - No TODO/FIXME in committed code
 * - No .only in tests
 * - No empty catch blocks
 * - No commented out code
 * - Functions must have return types
 */

const fs = require('fs');
const { execSync } = require('child_process');

function getStagedFiles() {
  try {
    const files = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    })
      .split('\n')
      .filter((f) => f.match(/\.(ts|tsx)$/))
      .filter(Boolean);
    return files;
  } catch (e) {
    return [];
  }
}

const QUALITY_RULES = [
  {
    pattern: /\/\/\s*(TODO|FIXME|HACK|XXX|OPTIMIZE|REFACTOR):/gi,
    message: 'TODO/FIXME comments not allowed in commits',
    severity: 'error',
    exclude: [],
  },
  {
    pattern: /\.(only|skip)\(/g,
    message: '.only() or .skip() found in tests - must run all tests',
    severity: 'error',
    exclude: [],
  },
  {
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
    message: 'Empty catch block - must handle errors',
    severity: 'error',
    exclude: [],
  },
  {
    pattern: /catch\s*\([^)]*\)\s*\{\s*\/\//g,
    message: 'Catch block with only comments - must handle errors',
    severity: 'error',
    exclude: [],
  },
  {
    pattern: /^\s*\/\/.*(?:import|export|function|const|let|var)/gm,
    message: 'Commented out code detected - remove dead code',
    severity: 'warning',
    exclude: [],
  },
  {
    pattern: /console\.(log|debug|info|warn|error)/g,
    message: 'console.* usage detected - use @app/logger',
    severity: 'error',
    exclude: ['*.test.ts', '*.spec.ts', 'tools/**'],
  },
];

// Check for missing return types on exported functions
function checkReturnTypes(filePath, content) {
  const violations = [];
  
  // Match exported functions without explicit return type
  const exportFunctionPattern = /export\s+(async\s+)?function\s+(\w+)\s*\([^)]*\)(?!\s*:\s*\w)/g;
  let match;
  
  while ((match = exportFunctionPattern.exec(content)) !== null) {
    violations.push({
      file: filePath,
      line: content.substring(0, match.index).split('\n').length,
      message: `Exported function '${match[2]}' missing explicit return type`,
      severity: 'error',
    });
  }
  
  return violations;
}

// Main execution
const files = getStagedFiles();
if (files.length === 0) {
  console.log('✅ No TypeScript files to validate');
  process.exit(0);
}

const violations = [];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check quality rules
    for (const rule of QUALITY_RULES) {
      // Check if file is excluded
      const isExcluded = rule.exclude.some((pattern) => {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(file);
      });
      
      if (isExcluded) continue;
      
      const matches = content.match(rule.pattern);
      if (matches) {
        violations.push({
          file,
          message: rule.message,
          matches: matches.length,
          severity: rule.severity,
        });
      }
    }
    
    // Check return types
    const returnTypeViolations = checkReturnTypes(file, content);
    violations.push(...returnTypeViolations);
    
  } catch (error) {
    // File might have been deleted, skip
    continue;
  }
}

if (violations.length > 0) {
  const errors = violations.filter((v) => v.severity === 'error');
  const warnings = violations.filter((v) => v.severity === 'warning');

  if (errors.length > 0) {
    console.error('\n❌ CODE QUALITY ISSUES (BLOCKING)\n');
    errors.forEach(({ file, message, matches, line }) => {
      console.error(`  ❌ ${file}${line ? `:${line}` : ''}`);
      console.error(`     ${message}`);
      if (matches) {
        console.error(`     Found ${matches} occurrence(s)\n`);
      } else {
        console.error('');
      }
    });
  }

  if (warnings.length > 0) {
    console.error('⚠️  CODE QUALITY WARNINGS\n');
    warnings.forEach(({ file, message, matches }) => {
      console.error(`  ⚠️  ${file}`);
      console.error(`     ${message}`);
      if (matches) {
        console.error(`     Found ${matches} occurrence(s)\n`);
      }
    });
  }

  if (errors.length > 0) {
    console.error('Fix these issues before committing.\n');
    console.error('Why this matters:');
    console.error('  - Code must be complete (no TODOs)');
    console.error('  - Tests must all run (no .only or .skip)');
    console.error('  - Errors must be handled (no empty catch)');
    console.error('  - Dead code must be removed (no commented code)');
    console.error('  - Functions must have explicit return types\n');
    process.exit(1);
  }
}

console.log('✅ Code quality validation passed');
