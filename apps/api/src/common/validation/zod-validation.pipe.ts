import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

import { AppError } from '../errors/app-error.js';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema?: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (!this.schema || metadata.type === 'custom') {
      return value;
    }

    const parsed = this.schema.safeParse(value);

    if (!parsed.success) {
      throw new AppError({
        code: 'validation_error',
        message: 'Request validation failed',
        statusCode: 400,
        details: parsed.error.flatten(),
        exposeDetails: true,
      });
    }

    return parsed.data;
  }
}
