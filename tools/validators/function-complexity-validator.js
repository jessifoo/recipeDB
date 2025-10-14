#!/usr/bin/env node

/**
 * Function Complexity Validator
 * Enforces functions are small and focused
 * - Max 50 lines per function
 * - Max 5 parameters
 * - Max 3 levels of nesting
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

const MAX_FUNCTION_LINES = 50;
const MAX_PARAMETERS = 5;
const MAX_NESTING_DEPTH = 3;

function analyzeFunctions(content, filePath) {
  const violations = [];
  
  // Simple function detection (won't catch all cases, but good enough)
  const functionPattern = /(?:function\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*(?::|=>))\s*{/g;
  
  let match;
  while ((match = functionPattern.exec(content)) !== null) {
    const functionName = match[1] || match[2];
    const startIndex = match.index;
    
    // Find matching closing brace
    let braceCount = 1;
    let endIndex = startIndex + match[0].length;
    
    while (braceCount > 0 && endIndex < content.length) {
      if (content[endIndex] === '{') braceCount++;
      if (content[endIndex] === '}') braceCount--;
      endIndex++;
    }
    
    const functionBody = content.substring(startIndex, endIndex);
    const lines = functionBody.split('\n');
    const lineCount = lines.length;
    
    // Check line count
    if (lineCount > MAX_FUNCTION_LINES) {
      violations.push({
        file: filePath,
        function: functionName,
        issue: `Function too long: ${lineCount} lines (max ${MAX_FUNCTION_LINES})`,
        severity: 'warning',
      });
    }
    
    // Check parameter count
    const paramMatch = functionBody.match(/\(([^)]*)\)/);
    if (paramMatch) {
      const params = paramMatch[1]
        .split(',')
        .filter((p) => p.trim().length > 0);
      
      if (params.length > MAX_PARAMETERS) {
        violations.push({
          file: filePath,
          function: functionName,
          issue: `Too many parameters: ${params.length} (max ${MAX_PARAMETERS})`,
          severity: 'warning',
        });
      }
    }
    
    // Check nesting depth
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (const char of functionBody) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      }
      if (char === '}') currentDepth--;
    }
    
    if (maxDepth > MAX_NESTING_DEPTH) {
      violations.push({
        file: filePath,
        function: functionName,
        issue: `Nesting too deep: ${maxDepth} levels (max ${MAX_NESTING_DEPTH})`,
        severity: 'warning',
      });
    }
  }
  
  return violations;
}

const files = getStagedFiles();
if (files.length === 0) {
  console.log('✅ No files to check for complexity');
  process.exit(0);
}

const violations = [];

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const fileViolations = analyzeFunctions(content, file);
    violations.push(...fileViolations);
  } catch (error) {
    continue;
  }
}

if (violations.length > 0) {
  console.error('\n⚠️  COMPLEXITY WARNINGS\n');
  console.error('Consider refactoring these functions:\n');
  
  violations.forEach(({ file, function: fn, issue }) => {
    console.error(`  ⚠️  ${file}`);
    console.error(`     Function: ${fn}`);
    console.error(`     ${issue}\n`);
  });
  
  console.error('Why this matters:');
  console.error('  - Small functions are easier to test');
  console.error('  - Less nesting improves readability');
  console.error('  - Fewer parameters reduce complexity\n');
  console.error('Tips:');
  console.error('  - Extract helper functions');
  console.error('  - Use object parameters for many args');
  console.error('  - Early return to reduce nesting\n');
  
  // Warning only, doesn't block
  console.error('⚠️  This is a WARNING. Consider refactoring.\n');
}

console.log('✅ Complexity check complete');
