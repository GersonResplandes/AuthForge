import { Injectable, LoggerService } from '@nestjs/common';
import pino, { type Logger, type LoggerOptions } from 'pino';

import { env } from '../../env.js';

type LogContext = Record<string, unknown>;

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    const loggerOptions: LoggerOptions = {
      base: {
        service: 'authforge-api',
      },
      level: env.LOG_LEVEL,
      redact: {
        paths: ['password', '*.password', 'token', '*.token', 'authorization', '*.authorization'],
        censor: '[redacted]',
      },
    };

    if (env.NODE_ENV === 'development') {
      loggerOptions.transport = {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
        },
      };
    }

    this.logger = pino(loggerOptions);
  }

  log(message: string, context?: string | LogContext): void {
    this.info(message, this.normalizeContext(context));
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(context ?? {}, message);
  }

  warn(message: string, context?: string | LogContext): void {
    this.logger.warn(this.normalizeContext(context), message);
  }

  error(message: string, traceOrContext?: string | LogContext, context?: string): void {
    const normalizedContext =
      typeof traceOrContext === 'string'
        ? {
            stack: traceOrContext,
            context,
          }
        : this.normalizeContext(traceOrContext);

    this.logger.error(normalizedContext, message);
  }

  debug(message: string, context?: string | LogContext): void {
    this.logger.debug(this.normalizeContext(context), message);
  }

  verbose(message: string, context?: string | LogContext): void {
    this.logger.trace(this.normalizeContext(context), message);
  }

  child(context: LogContext): Logger {
    return this.logger.child(context);
  }

  private normalizeContext(context: string | LogContext | undefined): LogContext {
    if (typeof context === 'string') {
      return { context };
    }

    return context ?? {};
  }
}
