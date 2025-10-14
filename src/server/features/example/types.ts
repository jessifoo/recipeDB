/**
 * Example Feature - Types and Schemas
 * DTOs, domain models, and validation schemas
 */

import { z } from 'zod';
import type { Example } from '@prisma/client';

/**
 * Domain Model - What the service layer works with
 */
export type ExampleDomain = Example;

/**
 * Create DTO
 */
export const createExampleSchema = z.object({
  name: z.string().min(1).max(100),
  content: z.string().min(1),
});

export type CreateExampleDTO = z.infer<typeof createExampleSchema>;

/**
 * Update DTO
 */
export const updateExampleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
});

export type UpdateExampleDTO = z.infer<typeof updateExampleSchema>;

/**
 * Query filters
 */
export const exampleFilterSchema = z.object({
  search: z.string().optional(),
}).optional();

export type ExampleFilter = z.infer<typeof exampleFilterSchema>;
