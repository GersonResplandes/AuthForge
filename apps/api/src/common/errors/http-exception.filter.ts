import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import type { Response } from 'express';

import { env } from '../../env.js';
import { AppLogger } from '../logger/app-logger.service.js';
import { REQUEST_ID_HEADER } from '../request-context/request-context.constants.js';

import { AppError } from './app-error.js';

type ErrorResponseBody = {
  statusCode: number;
  code: string;
  message: string;
  requestId?: string | undefined;
  details?: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(AppLogger) private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const requestIdHeader = response.getHeader(REQUEST_ID_HEADER);
    const requestId = typeof requestIdHeader === 'string' ? requestIdHeader : undefined;
    const body = this.buildResponseBody(exception, requestId);

    if (body.statusCode >= 500) {
      this.logger.error('Unhandled application error', {
        requestId,
        error: this.serializeError(exception),
      });
    } else {
      this.logger.warn('Request rejected', {
        requestId,
        code: body.code,
        statusCode: body.statusCode,
      });
    }

    response.status(body.statusCode).json(body);
  }

  private buildResponseBody(exception: unknown, requestId: string | undefined): ErrorResponseBody {
    if (exception instanceof AppError) {
      return {
        statusCode: exception.statusCode,
        code: exception.code,
        message: exception.message,
        requestId,
        ...(exception.exposeDetails || env.NODE_ENV !== 'production'
          ? { details: exception.details }
          : {}),
      };
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      return {
        statusCode,
        code: this.resolveHttpCode(statusCode),
        message: this.resolveHttpMessage(exception),
        requestId,
        ...(env.NODE_ENV !== 'production' ? { details: exception.getResponse() } : {}),
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'internal_server_error',
      message:
        env.NODE_ENV === 'production'
          ? 'Internal server error'
          : this.resolveUnknownMessage(exception),
      requestId,
    };
  }

  private resolveHttpCode(statusCode: number): string {
    return statusCode >= 500 ? 'internal_server_error' : 'http_request_error';
  }

  private resolveHttpMessage(exception: HttpException): string {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (this.hasMessage(response)) {
      return Array.isArray(response.message) ? response.message.join('; ') : response.message;
    }

    return exception.message;
  }

  private resolveUnknownMessage(exception: unknown): string {
    return exception instanceof Error ? exception.message : 'Unknown error';
  }

  private serializeError(exception: unknown): Record<string, unknown> {
    if (exception instanceof Error) {
      return {
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      };
    }

    return {
      message: 'Non-error exception thrown',
    };
  }

  private hasMessage(value: unknown): value is { message: string | string[] } {
    return (
      typeof value === 'object' &&
      value !== null &&
      'message' in value &&
      (typeof value.message === 'string' || Array.isArray(value.message))
    );
  }
}
