/**
 * Adapter Swap Test - Prove you can swap ANY implementation
 * Same service works with Prisma, In-Memory, or future MongoDB
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ExampleService } from '@/core/services/example.service';
import { InMemoryExampleRepository } from './in-memory.adapter';
import { ConsoleLogger } from '../logger/console.adapter';
import { InMemoryCache } from '../cache/in-memory.adapter';
import { InMemoryEventBus } from '../events/in-memory.adapter';

describe('Framework Independence - Swap ANY Implementation', () => {
  let service: ExampleService;
  let repository: InMemoryExampleRepository;
  let logger: ConsoleLogger;
  let cache: InMemoryCache;
  let eventBus: InMemoryEventBus;

  beforeEach(() => {
    logger = new ConsoleLogger('Test');
    repository = new InMemoryExampleRepository(logger);
    cache = new InMemoryCache();
    eventBus = new InMemoryEventBus();

    service = new ExampleService({
      repository,
      logger,
      cache,
      eventBus,
    });
  });

  it('should work with In-Memory adapter (no Prisma)', async () => {
    // Create
    const created = await service.create({
      name: 'In-Memory Test',
      content: 'No database needed!',
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('In-Memory Test');

    // Get by ID (should hit cache)
    const fetched = await service.getById(created.id);
    expect(fetched).toEqual(created);

    // List
    const list = await service.list();
    expect(list).toHaveLength(1);

    // Update
    const updated = await service.update(created.id, { name: 'Updated' });
    expect(updated.name).toBe('Updated');

    // Delete
    await service.delete(created.id);
    await expect(service.getById(created.id)).rejects.toThrow('Example not found');
  });

  it('should cache results', async () => {
    const created = await service.create({
      name: 'Cached',
      content: 'Test caching',
    });

    // First call - should cache
    await service.getById(created.id);
    expect(cache.size()).toBe(1);

    // Second call - should hit cache (repository not called again)
    const cached = await service.getById(created.id);
    expect(cached).toEqual(created);
  });

  it('should publish events', async () => {
    const events: any[] = [];
    
    eventBus.subscribe('example.created', async (event) => {
      events.push(event);
    });

    eventBus.subscribe('example.deleted', async (event) => {
      events.push(event);
    });

    const created = await service.create({
      name: 'Event Test',
      content: 'Testing events',
    });

    await service.delete(created.id);

    expect(events).toHaveLength(2);
    expect(events[0].eventType).toBe('example.created');
    expect(events[1].eventType).toBe('example.deleted');
  });

  it('should search with filter', async () => {
    await service.create({ name: 'Alpha', content: 'First' });
    await service.create({ name: 'Beta', content: 'Second' });
    await service.create({ name: 'Gamma', content: 'Third' });

    const results = await service.list({ search: 'eta' });
    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe('Beta');
  });

  it('should invalidate cache on updates', async () => {
    const created = await service.create({
      name: 'Original',
      content: 'Content',
    });

    // Cache it
    await service.getById(created.id);
    expect(cache.size()).toBeGreaterThan(0);

    // Update should invalidate
    await service.update(created.id, { name: 'Updated' });

    // Cache should be cleared for this item
    const cachedValue = await cache.get(`example:${created.id}`);
    expect(cachedValue).toBeNull();
  });
});

/**
 * To swap to Prisma: Just change the adapter
 * 
 * import { PrismaExampleRepository } from './prisma.adapter';
 * import { db } from '@/lib/db';
 * 
 * repository = new PrismaExampleRepository(db, logger);
 * 
 * Everything else stays THE SAME!
 */
