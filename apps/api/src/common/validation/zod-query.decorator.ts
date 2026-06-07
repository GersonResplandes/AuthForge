import { Query } from '@nestjs/common';
import type { ZodSchema } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe.js';

export function ZodQuery(schema: ZodSchema): ParameterDecorator {
  return Query(new ZodValidationPipe(schema));
}
