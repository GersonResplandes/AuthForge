import { Param } from '@nestjs/common';
import type { ZodSchema } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe.js';

export function ZodParam(schema: ZodSchema): ParameterDecorator {
  return Param(new ZodValidationPipe(schema));
}
