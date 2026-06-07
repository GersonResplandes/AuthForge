import { describe, expect, it } from '@jest/globals';
import type { ArgumentMetadata } from '@nestjs/common';
import { z } from 'zod';

import { AppError } from '../errors/app-error.js';

import { ZodValidationPipe } from './zod-validation.pipe.js';

const metadata: ArgumentMetadata = {
  type: 'body',
  metatype: undefined,
  data: undefined,
};

describe('ZodValidationPipe', () => {
  it('returns parsed data when input is valid', () => {
    const pipe = new ZodValidationPipe(
      z.object({
        email: z.string().email(),
      }),
    );

    expect(pipe.transform({ email: 'user@example.com' }, metadata)).toEqual({
      email: 'user@example.com',
    });
  });

  it('throws AppError when input is invalid', () => {
    const pipe = new ZodValidationPipe(
      z.object({
        email: z.string().email(),
      }),
    );

    expect(() => pipe.transform({ email: 'invalid-email' }, metadata)).toThrow(AppError);
  });
});
