/**
 * Repository Port - Interface for data access
 * Implementations: Prisma, MongoDB, DynamoDB, In-Memory, etc.
 */

/**
 * Generic repository interface - Framework agnostic
 */
export interface IRepository<T, TCreate, TUpdate> {
  findById(id: string): Promise<T | null>;
  findMany(filter?: unknown): Promise<T[]>;
  create(data: TCreate): Promise<T>;
  update(id: string, data: TUpdate): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Transaction support (optional, not all DBs support it)
 */
export interface ITransactionalRepository {
  executeInTransaction<T>(fn: () => Promise<T>): Promise<T>;
}

/**
 * Query builder interface (for complex queries)
 */
export interface IQueryBuilder<T> {
  where(condition: unknown): IQueryBuilder<T>;
  orderBy(field: string, direction: 'asc' | 'desc'): IQueryBuilder<T>;
  limit(count: number): IQueryBuilder<T>;
  offset(count: number): IQueryBuilder<T>;
  execute(): Promise<T[]>;
}
