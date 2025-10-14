/**
 * Logger Port - Interface for logging
 * Implementations: Console, Winston, Pino, Datadog, CloudWatch, etc.
 */

export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

/**
 * Logger factory - Create contextual loggers
 */
export interface ILoggerFactory {
  create(context: string): ILogger;
  createWithCorrelation(correlationId: string): ILogger;
}
