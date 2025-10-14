/**
 * Prisma Adapter - Implements IRepository port
 * Can swap to mongo.adapter.ts or dynamodb.adapter.ts
 */

import type { PrismaClient, Example } from '@prisma/client';
import type { IRepository } from '@/core/ports/repository.port';
import type { ILogger } from '@/core/ports/logger.port';
import type { CreateExampleDTO, UpdateExampleDTO, ExampleFilter } from '@/core/services/example.service';

export class PrismaExampleRepository implements IRepository<Example, CreateExampleDTO, UpdateExampleDTO> {
  constructor(
    private db: PrismaClient,
    private logger: ILogger
  ) {}

  async findById(id: string): Promise<Example | null> {
    try {
      return await this.db.example.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error('Prisma findById error', { error });
      throw new Error('Database error');
    }
  }

  async findMany(filter?: ExampleFilter): Promise<Example[]> {
    try {
      return await this.db.example.findMany({
        where: filter?.search ? {
          OR: [
            { name: { contains: filter.search, mode: 'insensitive' } },
            { content: { contains: filter.search, mode: 'insensitive' } },
          ],
        } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('Prisma findMany error', { error });
      throw new Error('Database error');
    }
  }

  async create(data: CreateExampleDTO): Promise<Example> {
    try {
      return await this.db.example.create({ data });
    } catch (error) {
      this.logger.error('Prisma create error', { error });
      throw new Error('Database error');
    }
  }

  async update(id: string, data: UpdateExampleDTO): Promise<Example> {
    try {
      return await this.db.example.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error('Prisma update error', { error });
      throw new Error('Database error');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.db.example.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Prisma delete error', { error });
      throw new Error('Database error');
    }
  }
}
