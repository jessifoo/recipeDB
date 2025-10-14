/**
 * Example Service Tests - Pure unit tests with mocked dependencies
 * NO database, NO tRPC - just business logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExampleService } from './example.service';
import type { Example } from '../domain/example.entity';
import type { IRepository } from '../ports/repository.port';
import type { ILogger } from '../ports/logger.port';
import type { ICache } from '../ports/cache.port';
import type { IEventBus } from '../ports/event-bus.port';

describe('ExampleService - Unit Tests (Mocked Dependencies)', () => {
  let mockRepository: IRepository<Example, any, any>;
  let mockLogger: ILogger;
  let mockCache: ICache;
  let mockEventBus: IEventBus;
  let service: ExampleService;

  beforeEach(() => {
    // Mock all dependencies
    mockRepository = {
      findById: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };

    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
    };

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn(),
    };

    service = new ExampleService({
      repository: mockRepository,
      logger: mockLogger,
      cache: mockCache,
      eventBus: mockEventBus,
    });
  });

  describe('getById', () => {
    it('should return cached example if available', async () => {
      const cachedExample: Example = {
        id: '1',
        name: 'Cached',
        content: 'From cache',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockCache.get).mockResolvedValue(cachedExample);

      const result = await service.getById('1');

      expect(result).toEqual(cachedExample);
      expect(mockCache.get).toHaveBeenCalledWith('example:1');
      expect(mockRepository.findById).not.toHaveBeenCalled(); // Should not hit DB
    });

    it('should fetch from repository and cache if not cached', async () => {
      const example: Example = {
        id: '1',
        name: 'Test',
        content: 'Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockRepository.findById).mockResolvedValue(example);

      const result = await service.getById('1');

      expect(result).toEqual(example);
      expect(mockCache.set).toHaveBeenCalledWith('example:1', example, 300);
    });

    it('should throw if example not found', async () => {
      vi.mocked(mockCache.get).mockResolvedValue(null);
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.getById('999')).rejects.toThrow('Example not found');
    });
  });

  describe('create', () => {
    it('should validate name length', async () => {
      await expect(service.create({ name: '', content: 'test' }))
        .rejects.toThrow('Name must be between');
    });

    it('should reject "test" in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      await expect(service.create({ name: 'test', content: 'content' }))
        .rejects.toThrow('Cannot use "test" as name in production');

      process.env.NODE_ENV = originalEnv;
    });

    it('should create example and publish event', async () => {
      const created: Example = {
        id: '1',
        name: 'New',
        content: 'Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(created);

      const result = await service.create({ name: 'New', content: 'Content' });

      expect(result).toEqual(created);
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'example.created',
          payload: { id: '1', name: 'New' },
        })
      );
      expect(mockCache.delete).toHaveBeenCalled(); // Invalidate cache
    });
  });

  describe('update', () => {
    it('should require at least one field', async () => {
      await expect(service.update('1', {}))
        .rejects.toThrow('Must provide at least one field');
    });

    it('should validate name if provided', async () => {
      await expect(service.update('1', { name: '' }))
        .rejects.toThrow('Name must be between');
    });

    it('should update and invalidate cache', async () => {
      const updated: Example = {
        id: '1',
        name: 'Updated',
        content: 'Content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.update).mockResolvedValue(updated);

      const result = await service.update('1', { name: 'Updated' });

      expect(result).toEqual(updated);
      expect(mockCache.delete).toHaveBeenCalledWith('example:1');
    });
  });

  describe('delete', () => {
    it('should delete and publish event', async () => {
      await service.delete('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(mockEventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'example.deleted',
          payload: { id: '1' },
        })
      );
      expect(mockCache.delete).toHaveBeenCalled();
    });
  });
});
