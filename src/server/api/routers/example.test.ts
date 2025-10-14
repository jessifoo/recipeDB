/**
 * Example router tests - Template for all routes
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from '../root';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

describe('Example Router', () => {
  const caller = appRouter.createCaller({ db, logger, headers: new Headers() });

  afterAll(async () => {
    // Cleanup
    await db.example.deleteMany({});
  });

  describe('ping', () => {
    it('should return ok status', async () => {
      const result = await caller.example.ping();
      
      expect(result.status).toBe('ok');
      expect(result.database).toBe('connected');
    });
  });

  describe('CRUD operations', () => {
    it('should create, read, update, and delete example', async () => {
      // CREATE
      const created = await caller.example.create({
        name: 'Test',
        content: 'Test content',
      });
      
      expect(created.id).toBeDefined();
      expect(created.name).toBe('Test');

      // READ
      const retrieved = await caller.example.getById(created.id);
      expect(retrieved).toEqual(created);

      // LIST
      const list = await caller.example.list();
      expect(list.length).toBeGreaterThan(0);

      // UPDATE
      const updated = await caller.example.update({
        id: created.id,
        name: 'Updated',
      });
      expect(updated.name).toBe('Updated');

      // DELETE
      const deleted = await caller.example.delete(created.id);
      expect(deleted.success).toBe(true);

      // Verify deleted
      await expect(caller.example.getById(created.id)).rejects.toThrow('Example not found');
    });

    it('should throw NOT_FOUND for non-existent example', async () => {
      await expect(
        caller.example.getById('nonexistent')
      ).rejects.toThrow('Example not found');
    });
  });
});
