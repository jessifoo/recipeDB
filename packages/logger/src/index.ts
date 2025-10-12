/**
 * @fileoverview CENTRALIZED LOGGING SYSTEM
 * 
 * ⚠️ THIS IS THE ONLY LOGGING IMPLEMENTATION ALLOWED IN THE ENTIRE CODEBASE
 * ⚠️ DO NOT CREATE console.log, winston, pino, or any other logger elsewhere
 * ⚠️ Import this logger: import { logger } from '@recipedb/logger'
 * 
 * Enforced by:
 * - ESLint rules (no-console, no-restricted-imports)
 * - Nx module boundaries
 * - Pre-commit hooks
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  module?: string;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private minLevel: LogLevel = LogLevel.INFO;

  private constructor() {
    // Singleton pattern - only one instance allowed
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    return levels.indexOf(level) <= levels.indexOf(this.minLevel);
  }

  private formatLog(context: LogContext): string {
    const { timestamp, level, message, module, data } = context;
    const moduleStr = module ? `[${module}]` : '';
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    return `${timestamp} ${level.toUpperCase()} ${moduleStr} ${message}${dataStr}`;
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const context: LogContext = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
      module: this.getCallerModule(),
    };

    const formatted = this.formatLog(context);

    // Output based on level
    switch (level) {
      case LogLevel.ERROR:
        console.error(formatted, error || '');
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
    }
  }

  private getCallerModule(): string {
    const stack = new Error().stack;
    if (!stack) return 'unknown';
    
    const lines = stack.split('\n');
    // Skip first 4 lines (Error, getCallerModule, log, public method)
    const callerLine = lines[4] || '';
    const match = callerLine.match(/at\s+(.+?)\s+\(/);
    return match ? match[1] : 'unknown';
  }

  error(message: string, error?: Error | unknown, data?: unknown): void {
    const errorObj = error instanceof Error ? error : undefined;
    const errorData = error instanceof Error ? data : error;
    this.log(LogLevel.ERROR, message, errorData, errorObj);
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }
}

// Export singleton instance - THIS IS THE ONLY LOGGER
export const logger = Logger.getInstance();

// Export for testing/configuration
export { Logger };
