import { HttpStatus } from '@nestjs/common';

export type AppErrorOptions = {
  code: string;
  message: string;
  statusCode?: number;
  details?: unknown;
  cause?: Error;
  exposeDetails?: boolean;
};

export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: unknown;
  readonly exposeDetails: boolean;

  constructor(options: AppErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = 'AppError';
    this.code = options.code;
    this.statusCode = options.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.details = options.details;
    this.exposeDetails = options.exposeDetails ?? false;
  }
}
