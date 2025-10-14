/**
 * In-Memory Cache Adapter - Implements ICache port
 * Can swap to redis.adapter.ts or memcached.adapter.ts
 */

import type { ICache } from '@/core/ports/cache.port';

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
}

export class InMemoryCache implements ICache {
  private cache = new Map<string, CacheEntry<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    // Check expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : undefined,
    };
    this.cache.set(key, entry);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // Helper for testing
  size(): number {
    return this.cache.size;
  }
}
