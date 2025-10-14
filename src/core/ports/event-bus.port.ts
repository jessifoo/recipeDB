/**
 * Event Bus Port - Interface for pub/sub
 * Implementations: In-Memory, RabbitMQ, Kafka, AWS EventBridge, etc.
 */

export interface DomainEvent {
  eventId: string;
  eventType: string;
  occurredAt: Date;
  payload: unknown;
}

export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
}

/**
 * Example domain events
 */
export interface ExampleCreatedEvent extends DomainEvent {
  eventType: 'example.created';
  payload: {
    id: string;
    name: string;
  };
}

export interface ExampleDeletedEvent extends DomainEvent {
  eventType: 'example.deleted';
  payload: {
    id: string;
  };
}
