/**
 * Example Repository - Data access layer
 * Isolates Prisma from business logic
 */

import type { Example } from '@prisma/client';
import { BaseRepository, type RepositoryDeps } from '@/server/core/repository.base';
import type { CreateExampleDTO, UpdateExampleDTO, ExampleFilter } from './types';

/**
 * Example repository interface
 */
export interface IExampleRepository {
  findById(id: string): Promise<Example | null>;
  findMany(filter?: ExampleFilter): Promise<Example[]>;
  create(data: CreateExampleDTO): Promise<Example>;
  update(id: string, data: UpdateExampleDTO): Promise<Example>;
  delete(id: string): Promise<void>;
}

/**
 * Example repository implementation
 */
export class ExampleRepository 
  extends BaseRepository<Example, CreateExampleDTO, UpdateExampleDTO>
  implements IExampleRepository {

  async findById(id: string): Promise<Example | null> {
    try {
      return await this.deps.db.example.findUnique({
        where: { id },
      });
    } catch (error) {
      return this.handleDbError(error, 'find example');
    }
  }

  async findMany(filter?: ExampleFilter): Promise<Example[]> {
    try {
      return await this.deps.db.example.findMany({
        where: filter?.search ? {
          OR: [
            { name: { contains: filter.search, mode: 'insensitive' } },
            { content: { contains: filter.search, mode: 'insensitive' } },
          ],
        } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      return this.handleDbError(error, 'list examples');
    }
  }

  async create(data: CreateExampleDTO): Promise<Example> {
    try {
      this.deps.logger.debug('Creating example', { data });
      return await this.deps.db.example.create({ data });
    } catch (error) {
      return this.handleDbError(error, 'create example');
    }
  }

  async update(id: string, data: UpdateExampleDTO): Promise<Example> {
    try {
      await this.findByIdOrThrow(id, 'Example');
      return await this.deps.db.example.update({
        where: { id },
        data,
      });
    } catch (error) {
      return this.handleDbError(error, 'update example');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.findByIdOrThrow(id, 'Example');
      await this.deps.db.example.delete({
        where: { id },
      });
    } catch (error) {
      return this.handleDbError(error, 'delete example');
    }
  }
}
