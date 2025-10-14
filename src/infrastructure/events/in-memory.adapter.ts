/**
 * In-Memory Event Bus Adapter - Implements IEventBus port
 * Can swap to rabbitmq.adapter.ts or kafka.adapter.ts
 */

import type { DomainEvent, IEventBus } from '@/core/ports/event-bus.port';

type EventHandler = (event: DomainEvent) => Promise<void>;

export class InMemoryEventBus implements IEventBus {
  private handlers = new Map<string, EventHandler[]>();

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    
    // Execute all handlers in parallel
    await Promise.all(handlers.map(handler => handler(event)));
  }

  subscribe(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  // Helper for testing
  clearHandlers(): void {
    this.handlers.clear();
  }
}
