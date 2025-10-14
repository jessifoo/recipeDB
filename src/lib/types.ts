/**
 * Shared type utilities and interfaces
 */

import type { PrismaClient } from '@prisma/client';
import type { ILogger } from './logger';

/**
 * Dependency container for injection
 */
export interface Dependencies {
  db: PrismaClient;
  logger: ILogger;
}

/**
 * Pagination input
 */
export interface PaginationInput {
  page?: number;
  limit?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * ID types for type safety
 */
export type UserId = string & { readonly __brand: 'UserId' };
export type ExampleId = string & { readonly __brand: 'ExampleId' };

/**
 * Brand utility - Create branded types
 */
export function brand<T extends string>(value: string): T {
  return value as T;
}
