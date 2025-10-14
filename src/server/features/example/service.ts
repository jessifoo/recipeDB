/**
 * Example Service - Business logic layer
 * Framework-agnostic, fully testable with mocked repository
 */

import type { Example } from '@prisma/client';
import { BaseService, type ServiceDeps } from '@/server/core/service.base';
import type { IExampleRepository } from './repository';
import type { CreateExampleDTO, UpdateExampleDTO, ExampleFilter } from './types';
import { ValidationError } from '@/lib/errors';

/**
 * Example service interface
 */
export interface IExampleService {
  getById(id: string): Promise<Example>;
  list(filter?: ExampleFilter): Promise<Example[]>;
  create(data: CreateExampleDTO): Promise<Example>;
  update(id: string, data: UpdateExampleDTO): Promise<Example>;
  delete(id: string): Promise<void>;
}

/**
 * Example service implementation
 */
export class ExampleService 
  extends BaseService<Example, CreateExampleDTO, UpdateExampleDTO, IExampleRepository>
  implements IExampleService {

  async getById(id: string): Promise<Example> {
    this.logger.info('Getting example by ID', { id });
    
    const example = await this.repository.findById(id);
    if (!example) {
      throw new ValidationError('Example not found', { id });
    }

    return example;
  }

  async list(filter?: ExampleFilter): Promise<Example[]> {
    this.logger.info('Listing examples', { filter });
    return this.repository.findMany(filter);
  }

  async create(data: CreateExampleDTO): Promise<Example> {
    this.logger.info('Creating example', { name: data.name });

    // Business rule: Name cannot be "test" in production
    if (process.env.NODE_ENV === 'production' && data.name.toLowerCase() === 'test') {
      throw new ValidationError('Cannot use "test" as name in production');
    }

    const example = await this.repository.create(data);
    this.logger.info('Example created successfully', { id: example.id });
    
    return example;
  }

  async update(id: string, data: UpdateExampleDTO): Promise<Example> {
    this.logger.info('Updating example', { id });

    // Business rule: Must provide at least one field to update
    if (!data.name && !data.content) {
      throw new ValidationError('Must provide at least one field to update');
    }

    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    this.logger.info('Deleting example', { id });
    await this.repository.delete(id);
    this.logger.info('Example deleted successfully', { id });
  }
}
