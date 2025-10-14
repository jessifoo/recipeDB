/**
 * Console Logger Adapter - Implements ILogger port
 * Can swap to winston.adapter.ts or datadog.adapter.ts
 */

import type { ILogger, ILoggerFactory } from '@/core/ports/logger.port';

export class ConsoleLogger implements ILogger {
  constructor(private context?: string, private correlationId?: string) {}

  private format(level: string, message: string, meta?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : '';
    const corr = this.correlationId ? `[${this.correlationId}]` : '';
    const data = meta ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}] ${ctx}${corr} ${message} ${data}`.trim();
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.log(this.format('INFO', message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(this.format('ERROR', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.format('WARN', message, context));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.format('DEBUG', message, context));
    }
  }
}

export class ConsoleLoggerFactory implements ILoggerFactory {
  create(context: string): ILogger {
    return new ConsoleLogger(context);
  }

  createWithCorrelation(correlationId: string): ILogger {
    return new ConsoleLogger(undefined, correlationId);
  }
}
