/**
 * In-Memory Adapter - For testing or simple use cases
 * Implements SAME IRepository interface as Prisma
 */

import type { Example } from '@/core/domain/example.entity';
import type { IRepository } from '@/core/ports/repository.port';
import type { ILogger } from '@/core/ports/logger.port';
import type { CreateExampleDTO, UpdateExampleDTO, ExampleFilter } from '@/core/services/example.service';

export class InMemoryExampleRepository implements IRepository<Example, CreateExampleDTO, UpdateExampleDTO> {
  private data: Map<string, Example> = new Map();
  private idCounter = 0;

  constructor(private logger: ILogger) {}

  async findById(id: string): Promise<Example | null> {
    return this.data.get(id) || null;
  }

  async findMany(filter?: ExampleFilter): Promise<Example[]> {
    let results = Array.from(this.data.values());

    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      results = results.filter(
        e => e.name.toLowerCase().includes(searchLower) || 
             e.content.toLowerCase().includes(searchLower)
      );
    }

    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(data: CreateExampleDTO): Promise<Example> {
    const example: Example = {
      id: `example-${++this.idCounter}`,
      name: data.name,
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.data.set(example.id, example);
    return example;
  }

  async update(id: string, data: UpdateExampleDTO): Promise<Example> {
    const existing = this.data.get(id);
    if (!existing) {
      throw new Error('Example not found');
    }

    const updated: Example = {
      ...existing,
      name: data.name ?? existing.name,
      content: data.content ?? existing.content,
      updatedAt: new Date(),
    };

    this.data.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    if (!this.data.has(id)) {
      throw new Error('Example not found');
    }
    this.data.delete(id);
  }

  // Test helper
  clear(): void {
    this.data.clear();
    this.idCounter = 0;
  }
}
