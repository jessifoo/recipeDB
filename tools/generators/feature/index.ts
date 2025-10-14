/**
 * Feature Generator - Creates complete CRUD feature
 * 
 * Usage: nx g feature recipe --fields="title:string,ingredients:string[],servings:number"
 * 
 * Creates:
 * - Domain entity with types
 * - Service with business logic structure
 * - Prisma adapter (repository)
 * - tRPC router
 * - Unit tests
 * - Integration tests
 * - Updates Prisma schema
 */

import type { Tree } from '@nx/devkit';
import { formatFiles, generateFiles, names } from '@nx/devkit';
import * as path from 'path';

interface FeatureGeneratorSchema {
  name: string;
  fields: string;
  adapter?: 'prisma' | 'mongo' | 'inmemory' | 'all';
  skipTests?: boolean;
}

interface Field {
  name: string;
  type: string;
  isArray: boolean;
  isOptional: boolean;
  zodType: string;
  prismaType: string;
}

/**
 * Parse field string into structured field objects
 */
function parseFields(fieldsString: string): Field[] {
  return fieldsString.split(',').map((field) => {
    const [name, typeRaw] = field.trim().split(':');
    if (!name || !typeRaw) {
      throw new Error(`Invalid field format: ${field}. Use format: name:type`);
    }

    const isArray = typeRaw.includes('[]');
    const isOptional = typeRaw.includes('?');
    const cleanType = typeRaw.replace('[]', '').replace('?', '').trim();

    // Map TypeScript types to Zod and Prisma types
    const typeMap: Record<string, { zod: string; prisma: string }> = {
      string: { zod: 'z.string()', prisma: 'String' },
      number: { zod: 'z.number()', prisma: 'Int' },
      boolean: { zod: 'z.boolean()', prisma: 'Boolean' },
      date: { zod: 'z.date()', prisma: 'DateTime' },
      'string[]': { zod: 'z.array(z.string())', prisma: 'String[]' },
      'number[]': { zod: 'z.array(z.number())', prisma: 'Int[]' },
    };

    const types = typeMap[isArray ? `${cleanType}[]` : cleanType] || typeMap.string;

    return {
      name: name.trim(),
      type: cleanType,
      isArray,
      isOptional,
      zodType: isOptional ? `${types.zod}.optional()` : types.zod,
      prismaType: types.prisma,
    };
  });
}

/**
 * Generate Prisma model string
 */
function generatePrismaModel(entityName: string, fields: Field[]): string {
  const modelName = names(entityName).className;
  
  let model = `\nmodel ${modelName} {\n`;
  model += `  id        String   @id @default(cuid())\n`;
  
  fields.forEach((field) => {
    const optional = field.isOptional ? '?' : '';
    model += `  ${field.name}    ${field.prismaType}${optional}\n`;
  });
  
  model += `  createdAt DateTime @default(now())\n`;
  model += `  updatedAt DateTime @updatedAt\n`;
  model += `}\n`;
  
  return model;
}

export default async function featureGenerator(tree: Tree, schema: FeatureGeneratorSchema) {
  const { name, fields: fieldsString, adapter = 'prisma', skipTests } = schema;
  
  // Parse fields
  const fields = parseFields(fieldsString);
  
  // Generate names
  const entityNames = names(name);
  const className = entityNames.className; // Recipe
  const propertyName = entityNames.propertyName; // recipe
  const constantName = entityNames.constantName; // RECIPE
  const fileName = entityNames.fileName; // recipe

  // Prepare template substitutions
  const substitutions = {
    ...entityNames,
    fields,
    fieldsJson: JSON.stringify(fields, null, 2),
    hasArrayFields: fields.some((f) => f.isArray),
    adapter,
    tmpl: '', // Remove __tmpl__ from file names
  };

  // Generate core files (always)
  const coreFiles = ['core/domain', 'core/services', 'core/ports'];
  coreFiles.forEach(dir => {
    const templatePath = path.join(__dirname, 'files', dir);
    const targetPath = `src/${dir}`;
    if (tree.exists(path.join(__dirname, 'files', dir))) {
      generateFiles(tree, templatePath, targetPath, substitutions);
    }
  });

  // Generate selected adapters
  const adaptersToGenerate = adapter === 'all' 
    ? ['prisma', 'mongo', 'inmemory'] 
    : [adapter];

  adaptersToGenerate.forEach(adapterType => {
    const adapterFile = `infrastructure/db/${adapterType}-__fileName__.adapter.ts__tmpl__`;
    const templatePath = path.join(__dirname, 'files', 'infrastructure/db');
    const targetPath = 'src/infrastructure/db';
    
    // Generate specific adapter
    const adapterTemplate = path.join(__dirname, 'files', adapterFile);
    if (tree.exists(adapterTemplate)) {
      generateFiles(tree, templatePath, targetPath, { 
        ...substitutions, 
        currentAdapter: adapterType 
      });
    }
  });

  // Generate API router
  const apiPath = path.join(__dirname, 'files', 'infrastructure/api');
  generateFiles(tree, apiPath, 'src/infrastructure/api', substitutions);

  // Update Prisma schema
  const prismaSchemaPath = 'prisma/schema.prisma';
  if (tree.exists(prismaSchemaPath)) {
    const currentSchema = tree.read(prismaSchemaPath, 'utf-8');
    const newModel = generatePrismaModel(name, fields);
    
    // Check if model already exists
    if (!currentSchema?.includes(`model ${className}`)) {
      tree.write(prismaSchemaPath, (currentSchema || '') + newModel);
      console.log(`✅ Added ${className} model to Prisma schema`);
    } else {
      console.log(`⚠️  ${className} model already exists in Prisma schema`);
    }
  }

  // Format files
  await formatFiles(tree);

  // Print success message
  const adaptersList = adapter === 'all' 
    ? 'prisma, mongo, inmemory'
    : adapter;

  console.log(`
✨ Feature "${name}" generated successfully!

Created:
  ✅ core/domain/${fileName}.entity.ts
  ✅ core/ports/${fileName}.repository.port.ts (database interface)
  ✅ core/services/${fileName}.service.ts
  ✅ infrastructure/db/${adaptersList}-${fileName}.adapter.ts
  ✅ infrastructure/api/${fileName}.router.ts
  ${!skipTests ? `✅ Tests for all layers` : ''}
  ${adapter === 'prisma' || adapter === 'all' ? `✅ Updated Prisma schema` : ''}

Next steps:
  ${adapter === 'prisma' || adapter === 'all' ? `1. Run: npx prisma migrate dev --name add-${fileName}` : ''}
  2. Add router to src/server/api/root.ts:
     import { ${propertyName}Router } from '@/infrastructure/api/${fileName}.router';
     export const appRouter = router({
       ${propertyName}: ${propertyName}Router,
     });
  3. Implement business logic in ${className}Service
  4. Run tests: npm test ${fileName}

💡 Swap databases easily:
   In ${fileName}.router.ts, just change the import:
   - import { Prisma${className}Repository } from '../db/prisma-${fileName}.adapter';
   + import { Mongo${className}Repository } from '../db/mongo-${fileName}.adapter';
`);

  return () => {
    console.log('\n🎉 Done! Your feature is ready to use.');
  };
}
