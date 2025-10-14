/**
 * Base Repository Pattern
 * Generic CRUD operations with dependency injection
 */

import type { PrismaClient } from '@prisma/client';
import type { ILogger } from '@/lib/logger';
import { NotFoundError, InternalError } from '@/lib/errors';

/**
 * Repository dependencies
 */
export interface RepositoryDeps {
  db: PrismaClient;
  logger: ILogger;
}

/**
 * Base repository interface - All repositories extend this
 */
export interface IRepository<T, TCreate, TUpdate> {
  findById(id: string): Promise<T | null>;
  findMany(filter?: unknown): Promise<T[]>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Abstract base repository - Implement in specific repositories
 */
export abstract class BaseRepository<T, TCreate, TUpdate> 
  implements IRepository<T, TCreate, TUpdate> {
  
  constructor(protected deps: RepositoryDeps) {}

  abstract findById(id: string): Promise<T | null>;
  abstract findMany(filter?: unknown): Promise<T[]>;
  abstract create(data: TCreate): Promise<T>;
  abstract update(id: string, data: TUpdate): Promise<T>;
  abstract delete(id: string): Promise<void>;

  /**
   * Helper: Find by ID or throw NotFoundError
   */
  protected async findByIdOrThrow(id: string, entityName: string): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundError(`${entityName} not found`, { id });
    }
    return entity;
  }

  /**
   * Helper: Catch and wrap database errors
   */
  protected handleDbError(error: unknown, operation: string): never {
    this.deps.logger.error(`Database error during ${operation}`, { error });
    throw new InternalError(`Failed to ${operation}`);
  }
}
