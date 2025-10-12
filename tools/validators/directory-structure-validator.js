#!/usr/bin/env node

/**
 * Directory Structure Validator
 * Enforces strict file placement rules
 * Prevents files in wrong locations
 */

const glob = require('glob');
const path = require('path');
const minimatch = require('minimatch');

const STRUCTURE_RULES = {
  'packages/domain/*/src': {
    allowed: ['*.entity.ts', '*.service.ts', '*.repo.ts', '*.schema.ts', 'factory.ts', 'index.ts'],
    banned: ['*.component.tsx', '*.page.tsx'],
    reason: 'Domain layer cannot contain UI components',
  },
  'packages/domain/*/tests': {
    allowed: ['*.test.ts', '*.spec.ts'],
    banned: ['*.tsx'],
    reason: 'Only test files allowed in tests directory',
  },
  'packages/api/src/routers': {
    allowed: ['*.router.ts'],
    banned: ['*.service.ts', '*.component.tsx'],
    reason: 'Only tRPC routers allowed in routers directory',
  },
  'packages/ui/src/components': {
    allowed: ['*/*.tsx', '*/*.test.tsx', '*/*.stories.tsx', '*/*.module.css', '*/index.ts'],
    banned: ['*.service.ts', '*.repo.ts'],
    reason: 'UI components only - no business logic',
  },
  'apps/web/src/app': {
    allowed: ['*/page.tsx', '*/layout.tsx', '*/loading.tsx', '*/error.tsx', '*/not-found.tsx', '*/route.ts'],
    banned: ['*.service.ts', '*.repo.ts', '*.entity.ts'],
    reason: 'App router - business logic belongs in packages/',
  },
};

function validateStructure() {
  const violations = [];

  for (const [pattern, rules] of Object.entries(STRUCTURE_RULES)) {
    const basePath = pattern.replace('*', '**');
    const files = glob.sync(`${basePath}/**/*`, {
      nodir: true,
      ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    });

    for (const file of files) {
      const relativePath = path.relative(
        pattern.split('/').slice(0, -1).join('/'),
        file
      );
      const fileName = path.basename(file);

      // Check if file is allowed
      const isAllowed = rules.allowed.some((allowedPattern) =>
        minimatch(relativePath, allowedPattern)
      );

      if (!isAllowed) {
        violations.push({
          file,
          reason: `File type not allowed here. Allowed: ${rules.allowed.join(', ')}`,
        });
        continue;
      }

      // Check if file is banned
      if (rules.banned) {
        const isBanned = rules.banned.some((bannedPattern) =>
          minimatch(fileName, bannedPattern)
        );

        if (isBanned) {
          violations.push({
            file,
            reason: rules.reason || 'File type banned in this location',
          });
        }
      }
    }
  }

  return violations;
}

// Main execution
const violations = validateStructure();

if (violations.length > 0) {
  console.error('\n❌ DIRECTORY STRUCTURE VIOLATIONS\n');
  console.error('Files are in wrong locations:\n');

  violations.forEach(({ file, reason }) => {
    console.error(`  ${file}`);
    console.error(`    → ${reason}\n`);
  });

  console.error('Move files to appropriate locations.\n');
  process.exit(1);
}

console.log('✅ Directory structure validation passed');
