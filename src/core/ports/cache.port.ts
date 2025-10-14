/**
 * Cache Port - Interface for caching
 * Implementations: Redis, Memcached, In-Memory, etc.
 */

export interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Cache key builder for consistency
 */
export class CacheKeyBuilder {
  static example(id: string): string {
    return `example:${id}`;
  }

  static exampleList(filter?: unknown): string {
    return `examples:${JSON.stringify(filter || {})}`;
  }
}
