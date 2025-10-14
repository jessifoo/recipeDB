#!/usr/bin/env node

/**
 * Type Coverage Validator
 * Ensures no 'any' types slip through
 * Uses TypeScript's --noImplicitAny is already on, but this catches explicit 'any'
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

const ALLOWED_ANY_FILES = [
  'tools/',          // Build tools can use any
  '.test.ts',        // Tests can use any for mocks
  '.spec.ts',        // Specs can use any for mocks
];

const violations = [];
const files = getStagedFiles();

for (const file of files) {
  // Check if file is in allowed list
  const isAllowed = ALLOWED_ANY_FILES.some((pattern) => file.includes(pattern));
  if (isAllowed) continue;

  try {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for explicit 'any' types
    const anyPatterns = [
      /:\s*any(?!\w)/g,           // : any
      /<any>/g,                   // <any>
      /as\s+any(?!\w)/g,          // as any
      /any\[\]/g,                 // any[]
      /Array<any>/g,              // Array<any>
      /Record<[^,]+,\s*any>/g,   // Record<string, any>
    ];
    
    let lineNumber = 0;
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      lineNumber = i + 1;
      
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
        continue;
      }
      
      for (const pattern of anyPatterns) {
        if (pattern.test(line)) {
          violations.push({
            file,
            line: lineNumber,
            snippet: line.trim(),
          });
          break; // Only report once per line
        }
      }
    }
  } catch (error) {
    // File deleted, skip
    continue;
  }
}

if (violations.length > 0) {
  console.error('\n❌ TYPE SAFETY VIOLATIONS\n');
  console.error('Explicit "any" types detected:\n');
  
  violations.forEach(({ file, line, snippet }) => {
    console.error(`  ❌ ${file}:${line}`);
    console.error(`     ${snippet}\n`);
  });
  
  console.error('Why this matters:');
  console.error('  - "any" defeats TypeScript safety');
  console.error('  - Use proper types or "unknown" instead');
  console.error('  - For truly dynamic data, use branded types\n');
  console.error('Fix:');
  console.error('  - Replace "any" with proper type');
  console.error('  - Use "unknown" and narrow with type guards');
  console.error('  - Use branded types from @app/types\n');
  
  process.exit(1);
}

console.log('✅ Type coverage validation passed (no explicit "any" types)');
