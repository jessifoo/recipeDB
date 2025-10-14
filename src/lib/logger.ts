/**
 * Logger - Simple wrapper around console
 * Future: Swap for Winston/Pino without changing code
 * 
 * Usage: logger.info('User created', { userId: 123 })
 */

type LogFn = (message: string, context?: Record<string, unknown>) => void;

export const logger = {
  info: ((message, context) => {
    console.log(`[INFO] ${message}`, context || '');
  }) as LogFn,

  error: ((message, context) => {
    console.error(`[ERROR] ${message}`, context || '');
  }) as LogFn,

  warn: ((message, context) => {
    console.warn(`[WARN] ${message}`, context || '');
  }) as LogFn,

  debug: ((message, context) => {
    console.debug(`[DEBUG] ${message}`, context || '');
  }) as LogFn,
};
