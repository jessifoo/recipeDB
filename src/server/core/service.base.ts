/**
 * Base Service Pattern
 * Business logic layer - Framework agnostic, fully testable
 */

import type { ILogger } from '@/lib/logger';

/**
 * Service dependencies - Injected for testability
 */
export interface ServiceDeps<TRepository = unknown> {
  repository: TRepository;
  logger: ILogger;
}

/**
 * Base service interface
 */
export interface IService<T, TCreate, TUpdate> {
  getById(id: string): Promise<T>;
  list(filter?: unknown): Promise<T[]>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Abstract base service - Implement in specific services
 */
export abstract class BaseService<T, TCreate, TUpdate, TRepository> 
  implements IService<T, TCreate, TUpdate> {
  
  protected repository: TRepository;
  protected logger: ILogger;

  constructor(deps: ServiceDeps<TRepository>) {
    this.repository = deps.repository;
    this.logger = deps.logger;
  }

  abstract getById(id: string): Promise<T>;
  abstract list(filter?: unknown): Promise<T[]>;
  abstract create(data: TCreate): Promise<T>;
  abstract update(id: string, data: TUpdate): Promise<T>;
  abstract delete(id: string): Promise<void>;
}
