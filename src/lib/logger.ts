/**
 * Structured Logger with Correlation ID support
 * Interface-based for easy swapping (Console → Winston → Datadog)
 */

export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

/**
 * Console logger implementation
 * In production, swap for Winston/Pino without changing consumers
 */
class ConsoleLogger implements ILogger {
  constructor(private correlationId?: string) {}

  private format(level: string, message: string, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const correlation = this.correlationId ? `[${this.correlationId}]` : '';
    const ctx = context ? JSON.stringify(context) : '';
    return `${timestamp} [${level}] ${correlation} ${message} ${ctx}`.trim();
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

/**
 * Create logger instance with optional correlation ID
 * @example
 * const logger = createLogger('request-123');
 * logger.info('User created', { userId: 1 });
 */
export function createLogger(correlationId?: string): ILogger {
  return new ConsoleLogger(correlationId);
}

/**
 * Default logger instance (for non-request contexts)
 */
export const logger = createLogger();
