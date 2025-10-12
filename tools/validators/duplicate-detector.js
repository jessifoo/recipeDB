#!/usr/bin/env node

/**
 * Duplicate Detector
 * Finds duplicate function/class exports across codebase
 * Prevents AI from recreating existing functionality
 */

const fs = require('fs');
const glob = require('glob');
const ts = require('typescript');

const exportedSymbols = new Map();

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const exports = [];

  function visit(node) {
    // Exported functions
    if (
      ts.isFunctionDeclaration(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if (node.name) {
        exports.push({
          type: 'function',
          name: node.name.text,
        });
      }
    }

    // Exported classes
    if (
      ts.isClassDeclaration(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if (node.name) {
        exports.push({
          type: 'class',
          name: node.name.text,
        });
      }
    }

    // Exported constants
    if (
      ts.isVariableStatement(node) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      node.declarationList.declarations.forEach((decl) => {
        if (ts.isIdentifier(decl.name)) {
          exports.push({
            type: 'const',
            name: decl.name.text,
          });
        }
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return exports;
}

function findDuplicates() {
  const allFiles = glob.sync('packages/**/src/**/*.ts', {
    ignore: ['**/*.test.ts', '**/*.spec.ts', '**/node_modules/**'],
  });

  const duplicates = [];

  for (const file of allFiles) {
    try {
      const exports = analyzeFile(file);

      for (const exp of exports) {
        const key = `${exp.type}:${exp.name}`;

        if (exportedSymbols.has(key)) {
          const existing = exportedSymbols.get(key);
          duplicates.push({
            symbol: exp.name,
            type: exp.type,
            files: [existing, file],
          });
        } else {
          exportedSymbols.set(key, file);
        }
      }
    } catch (e) {
      // Skip files with syntax errors
      continue;
    }
  }

  return duplicates;
}

// Main execution
const duplicates = findDuplicates();

if (duplicates.length > 0) {
  console.error('\n❌ DUPLICATE EXPORTS DETECTED\n');
  console.error('AI is recreating functionality that already exists:\n');

  duplicates.forEach(({ symbol, type, files }) => {
    console.error(`  ${type} "${symbol}":`);
    files.forEach((f) => console.error(`    - ${f}`));
    console.error('');
  });

  console.error('Remove duplicates or use existing implementation.\n');
  process.exit(1);
}

console.log('✅ No duplicate exports found');
