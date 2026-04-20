import { env } from '@/config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: Record<string, unknown>;
};

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Structured logger with configurable log levels and contextual metadata.
 *
 * In production, this can be swapped for a remote logging service
 * (e.g., Datadog, Sentry) by replacing the `output` method.
 *
 * @example
 * ```ts
 * const logger = createLogger('TaxApi');
 * logger.info('Fetching tax brackets', { year: 2022 });
 * logger.error('API request failed', { status: 500 });
 * ```
 */
class Logger {
  private readonly context: string;
  private readonly minLevel: LogLevel;

  constructor(context: string, minLevel?: LogLevel) {
    this.context = context;
    this.minLevel = minLevel ?? (env.logLevel as LogLevel);
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data);
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      ...(data && { data }),
    };

    this.output(entry);
  }

  /**
   * Outputs a log entry. Override this method to integrate
   * with external logging services in production.
   */
  private output(entry: LogEntry): void {
    const method = entry.level === 'debug' ? 'log' : entry.level;
    // biome-ignore lint/suspicious/noConsole: Logger is the only allowed console consumer
    console[method](`[${entry.context}]`, entry.message, entry.data ?? '');
  }
}

/**
 * Factory function to create a scoped logger instance.
 *
 * @param context - Module or feature name for log grouping
 */
export function createLogger(context: string, minLevel?: LogLevel): Logger {
  return new Logger(context, minLevel);
}
