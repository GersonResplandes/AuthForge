import { Body } from '@nestjs/common';
import type { ZodSchema } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe.js';

export function ZodBody(schema: ZodSchema): ParameterDecorator {
  return Body(new ZodValidationPipe(schema));
}
