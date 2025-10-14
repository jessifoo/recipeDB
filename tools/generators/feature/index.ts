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
  const { name, fields: fieldsString, skipTests } = schema;
  
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
    tmpl: '', // Remove __tmpl__ from file names
  };

  // Generate files from templates
  const templatePath = path.join(__dirname, 'files');
  const targetPath = 'src';
  
  generateFiles(tree, templatePath, targetPath, substitutions);

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
  console.log(`
✨ Feature "${name}" generated successfully!

Created:
  ✅ core/domain/${fileName}.entity.ts
  ✅ core/services/${fileName}.service.ts
  ✅ infrastructure/db/prisma-${fileName}.adapter.ts
  ✅ infrastructure/api/${fileName}.router.ts
  ${!skipTests ? `✅ Tests for all layers` : ''}
  ✅ Updated Prisma schema

Next steps:
  1. Run: npx prisma migrate dev --name add-${fileName}
  2. Add router to src/server/api/root.ts:
     import { ${propertyName}Router } from '@/infrastructure/api/${fileName}.router';
     export const appRouter = router({
       ${propertyName}: ${propertyName}Router,
     });
  3. Implement business logic in ${className}Service
  4. Run tests: npm test ${fileName}
`);

  return () => {
    console.log('\n🎉 Done! Your feature is ready to use.');
  };
}
