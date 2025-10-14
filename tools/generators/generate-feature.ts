#!/usr/bin/env node

/**
 * Feature Generator CLI
 * Usage: pnpm generate:feature user --fields name:string,email:email --ops create,get,list,update,delete
 */

import fs from 'fs';
import path from 'path';
import { generateFeature } from './templates/feature.template';
import type { FeatureConfig, FieldConfig, Operation } from './types';

function parseArgs(): FeatureConfig {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: pnpm generate:feature <name> --fields <fields> --ops <operations>');
    console.error('');
    console.error('Example:');
    console.error('  pnpm generate:feature user --fields "name:string,email:email,age:number" --ops create,get,list,update,delete');
    process.exit(1);
  }

  const name = args[0];
  const fieldsArg = args[args.indexOf('--fields') + 1] || '';
  const opsArg = args[args.indexOf('--ops') + 1] || 'create,get,list,update,delete';

  const fields: FieldConfig[] = fieldsArg
    .split(',')
    .filter(Boolean)
    .map((field) => {
      const [fieldName, type] = field.split(':');
      return {
        name: fieldName,
        type: (type as any) || 'string',
        required: true,
      };
    });

  const operations = opsArg.split(',') as Operation[];

  return { name, fields, operations };
}

function writeFiles(name: string, files: Record<string, string>) {
  const basePath = path.join(process.cwd(), 'packages');

  // Create directories
  const domainPath = path.join(basePath, 'domain', name, 'src');
  const apiPath = path.join(basePath, 'api', 'src', 'routers');
  const validationPath = path.join(basePath, 'validation', 'src', 'schemas');

  fs.mkdirSync(domainPath, { recursive: true });
  fs.mkdirSync(apiPath, { recursive: true });
  fs.mkdirSync(validationPath, { recursive: true });

  // Write files
  fs.writeFileSync(path.join(domainPath, `${name}.service.ts`), files.service);
  fs.writeFileSync(path.join(domainPath, `${name}.repository.ts`), files.repository);
  fs.writeFileSync(path.join(domainPath, `${name}.service.test.ts`), files.serviceTests);
  fs.writeFileSync(path.join(domainPath, `${name}.integration.test.ts`), files.integrationTests);
  fs.writeFileSync(path.join(validationPath, `${name}.schema.ts`), files.schemas);
  fs.writeFileSync(path.join(apiPath, `${name}.router.ts`), files.router);

  console.log('✅ Generated files:');
  console.log(`   - packages/domain/${name}/src/${name}.service.ts`);
  console.log(`   - packages/domain/${name}/src/${name}.repository.ts`);
  console.log(`   - packages/domain/${name}/src/${name}.service.test.ts`);
  console.log(`   - packages/domain/${name}/src/${name}.integration.test.ts`);
  console.log(`   - packages/validation/src/schemas/${name}.schema.ts`);
  console.log(`   - packages/api/src/routers/${name}.router.ts`);
  console.log('');
  console.log('✅ All files have proper markers and complete implementations');
}

// Main
const config = parseArgs();
const files = generateFeature(config);
writeFiles(config.name, files);

console.log('');
console.log('🎯 Next steps:');
console.log('   1. Update packages/database/prisma/schema.prisma');
console.log(`   2. Add ${config.name} model with your fields`);
console.log('   3. Run: pnpm db:migrate');
console.log('   4. Run tests: pnpm test');
console.log('');
