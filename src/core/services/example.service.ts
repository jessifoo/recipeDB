/**
 * Example Service - Pure business logic
 * NO framework imports - uses ONLY port interfaces
 */

import type { Example } from '../domain/example.entity';
import { ExampleRules } from '../domain/example.entity';
import type { IRepository } from '../ports/repository.port';
import type { ILogger } from '../ports/logger.port';
import type { ICache } from '../ports/cache.port';
import type { IEventBus } from '../ports/event-bus.port';
import { CacheKeyBuilder } from '../ports/cache.port';

/**
 * DTOs - Data Transfer Objects
 */
export interface CreateExampleDTO {
  name: string;
  content: string;
}

export interface UpdateExampleDTO {
  name?: string;
  content?: string;
}

export interface ExampleFilter {
  search?: string;
}

/**
 * Service dependencies - Injected via constructor
 */
export interface ExampleServiceDeps {
  repository: IRepository<Example, CreateExampleDTO, UpdateExampleDTO>;
  logger: ILogger;
  cache?: ICache;
  eventBus?: IEventBus;
}

/**
 * Example Service - Framework agnostic
 * Can work with ANY repository, logger, cache, event bus implementation
 */
export class ExampleService {
  constructor(private deps: ExampleServiceDeps) {}

  async getById(id: string): Promise<Example> {
    this.deps.logger.info('Getting example by ID', { id });

    // Try cache first (if available)
    if (this.deps.cache) {
      const cached = await this.deps.cache.get<Example>(CacheKeyBuilder.example(id));
      if (cached) {
        this.deps.logger.debug('Cache hit', { id });
        return cached;
      }
    }

    const example = await this.deps.repository.findById(id);
    if (!example) {
      throw new Error('Example not found');
    }

    // Cache for future requests
    if (this.deps.cache) {
      await this.deps.cache.set(CacheKeyBuilder.example(id), example, 300); // 5 min TTL
    }

    return example;
  }

  async list(filter?: ExampleFilter): Promise<Example[]> {
    this.deps.logger.info('Listing examples', { filter });
    return this.deps.repository.findMany(filter);
  }

  async create(data: CreateExampleDTO): Promise<Example> {
    this.deps.logger.info('Creating example', { name: data.name });

    // Validate business rules
    ExampleRules.validateName(data.name);
    ExampleRules.validateContent(data.content);
    ExampleRules.cannotBeTestInProduction(data.name);

    const example = await this.deps.repository.create(data);
    this.deps.logger.info('Example created successfully', { id: example.id });

    // Invalidate cache
    if (this.deps.cache) {
      await this.deps.cache.delete(CacheKeyBuilder.exampleList());
    }

    // Publish event (if event bus available)
    if (this.deps.eventBus) {
      await this.deps.eventBus.publish({
        eventId: `${example.id}-created`,
        eventType: 'example.created',
        occurredAt: new Date(),
        payload: { id: example.id, name: example.name },
      });
    }

    return example;
  }

  async update(id: string, data: UpdateExampleDTO): Promise<Example> {
    this.deps.logger.info('Updating example', { id });

    // Business rule: Must provide at least one field
    if (!data.name && !data.content) {
      throw new Error('Must provide at least one field to update');
    }

    // Validate if provided
    if (data.name) {
      ExampleRules.validateName(data.name);
    }
    if (data.content) {
      ExampleRules.validateContent(data.content);
    }

    const example = await this.deps.repository.update(id, data);

    // Invalidate cache
    if (this.deps.cache) {
      await this.deps.cache.delete(CacheKeyBuilder.example(id));
      await this.deps.cache.delete(CacheKeyBuilder.exampleList());
    }

    return example;
  }

  async delete(id: string): Promise<void> {
    this.deps.logger.info('Deleting example', { id });
    await this.deps.repository.delete(id);
    this.deps.logger.info('Example deleted successfully', { id });

    // Invalidate cache
    if (this.deps.cache) {
      await this.deps.cache.delete(CacheKeyBuilder.example(id));
      await this.deps.cache.delete(CacheKeyBuilder.exampleList());
    }

    // Publish event
    if (this.deps.eventBus) {
      await this.deps.eventBus.publish({
        eventId: `${id}-deleted`,
        eventType: 'example.deleted',
        occurredAt: new Date(),
        payload: { id },
      });
    }
  }
}
