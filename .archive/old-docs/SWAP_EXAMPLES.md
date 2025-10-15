# 🔄 How to Swap Frameworks

## Database: Prisma → MongoDB

### 1. Create MongoDB Adapter

```typescript
// src/infrastructure/db/mongo.adapter.ts
import type { MongoClient } from 'mongodb';
import type { IRepository } from '@/core/ports/repository.port';
import type { Example } from '@/core/domain/example.entity';

export class MongoExampleRepository implements IRepository<Example, any, any> {
  constructor(
    private client: MongoClient,
    private logger: ILogger
  ) {}

  async findById(id: string): Promise<Example | null> {
    const db = this.client.db('myapp');
    const doc = await db.collection('examples').findOne({ _id: id });
    return doc ? this.mapToEntity(doc) : null;
  }

  async create(data: any): Promise<Example> {
    const db = this.client.db('myapp');
    const result = await db.collection('examples').insertOne(data);
    return this.mapToEntity({ _id: result.insertedId, ...data });
  }

  // ... implement other methods

  private mapToEntity(doc: any): Example {
    return {
      id: doc._id.toString(),
      name: doc.name,
      content: doc.content,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
```

### 2. Update Composition Root

```typescript
// src/infrastructure/api/trpc.adapter.ts

// Before
import { PrismaExampleRepository } from '../db/prisma.adapter';
import { db } from '@/lib/db';

const repository = new PrismaExampleRepository(db, logger);

// After
import { MongoExampleRepository } from '../db/mongo.adapter';
import { mongoClient } from '@/lib/mongo';

const repository = new MongoExampleRepository(mongoClient, logger);
```

### 3. Done!

**No changes to:**
- `core/services/example.service.ts` ✅
- `core/domain/example.entity.ts` ✅  
- Business logic ✅
- Tests ✅

---

## Logger: Console → Winston

### 1. Create Winston Adapter

```typescript
// src/infrastructure/logger/winston.adapter.ts
import winston from 'winston';
import type { ILogger } from '@/core/ports/logger.port';

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor(correlationId?: string) {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      defaultMeta: { correlationId },
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }),
      ],
    });
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(message, context);
  }
}
```

### 2. Swap Implementation

```typescript
// Before
import { ConsoleLogger } from '../logger/console.adapter';
const logger = new ConsoleLogger('Service', correlationId);

// After
import { WinstonLogger } from '../logger/winston.adapter';
const logger = new WinstonLogger(correlationId);
```

### 3. Done!

**All services use `ILogger` interface - nothing breaks!**

---

## API: tRPC → REST

### 1. Create Express Adapter

```typescript
// src/infrastructure/api/rest.adapter.ts
import express from 'express';
import { ExampleService } from '@/core/services/example.service';
import { PrismaExampleRepository } from '../db/prisma.adapter';
import { ConsoleLogger } from '../logger/console.adapter';

const router = express.Router();

router.get('/examples/:id', async (req, res) => {
  const logger = new ConsoleLogger('API');
  const repository = new PrismaExampleRepository(db, logger);
  const service = new ExampleService({ repository, logger });

  try {
    const result = await service.getById(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/examples', async (req, res) => {
  const logger = new ConsoleLogger('API');
  const repository = new PrismaExampleRepository(db, logger);
  const service = new ExampleService({ repository, logger });

  try {
    const result = await service.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ... other endpoints

export default router;
```

### 2. Use in App

```typescript
// src/app/api/[...all]/route.ts
import restRouter from '@/infrastructure/api/rest.adapter';

app.use('/api', restRouter);
```

### 3. Done!

**Same `ExampleService` works with both tRPC and REST!**

---

## Cache: In-Memory → Redis

### 1. Create Redis Adapter

```typescript
// src/infrastructure/cache/redis.adapter.ts
import { createClient } from 'redis';
import type { ICache } from '@/core/ports/cache.port';

export class RedisCache implements ICache {
  private client: ReturnType<typeof createClient>;

  constructor(url: string) {
    this.client = createClient({ url });
    this.client.connect();
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.client.setEx(key, ttl, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    await this.client.flushAll();
  }
}
```

### 2. Swap Implementation

```typescript
// Before
import { InMemoryCache } from '../cache/in-memory.adapter';
const cache = new InMemoryCache();

// After
import { RedisCache } from '../cache/redis.adapter';
const cache = new RedisCache(process.env.REDIS_URL);
```

### 3. Done!

**Service doesn't know or care what cache implementation you use!**

---

## Event Bus: In-Memory → RabbitMQ

### 1. Create RabbitMQ Adapter

```typescript
// src/infrastructure/events/rabbitmq.adapter.ts
import amqp from 'amqplib';
import type { DomainEvent, IEventBus } from '@/core/ports/event-bus.port';

export class RabbitMQEventBus implements IEventBus {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  async connect(url: string): Promise<void> {
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
  }

  async publish(event: DomainEvent): Promise<void> {
    await this.channel.assertExchange('events', 'topic', { durable: true });
    this.channel.publish(
      'events',
      event.eventType,
      Buffer.from(JSON.stringify(event))
    );
  }

  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
    this.channel.assertQueue('', { exclusive: true }).then((q) => {
      this.channel.bindQueue(q.queue, 'events', eventType);
      this.channel.consume(q.queue, async (msg) => {
        if (msg) {
          const event = JSON.parse(msg.content.toString());
          await handler(event);
          this.channel.ack(msg);
        }
      });
    });
  }
}
```

### 2. Swap Implementation

```typescript
// Before
import { InMemoryEventBus } from '../events/in-memory.adapter';
const eventBus = new InMemoryEventBus();

// After
import { RabbitMQEventBus } from '../events/rabbitmq.adapter';
const eventBus = new RabbitMQEventBus();
await eventBus.connect(process.env.RABBITMQ_URL);
```

### 3. Done!

**Publish/subscribe works the same - implementation swapped!**

---

## Key Insights

### ✅ What Stays the Same (Never Changes)
- `core/domain/*.entity.ts` - Business entities
- `core/services/*.service.ts` - Business logic
- `core/ports/*.port.ts` - Interfaces
- All tests using mocked dependencies

### 🔄 What You Swap (Easy to Change)
- `infrastructure/db/*.adapter.ts` - Database implementation
- `infrastructure/logger/*.adapter.ts` - Logger implementation  
- `infrastructure/cache/*.adapter.ts` - Cache implementation
- `infrastructure/api/*.adapter.ts` - API transport
- Composition roots (where you wire dependencies)

### 🎯 Benefits

1. **Test without infrastructure** - Mock all ports
2. **Migrate gradually** - Run Prisma + MongoDB side-by-side
3. **A/B test implementations** - Redis vs Memcached performance
4. **Future-proof** - New framework? Just create an adapter
5. **Zero business logic changes** - Core is framework-free

---

**This is hexagonal architecture done right.**
