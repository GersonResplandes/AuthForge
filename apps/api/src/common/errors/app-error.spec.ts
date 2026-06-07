import { describe, expect, it } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';

import { AppError } from './app-error.js';

describe('AppError', () => {
  it('keeps a stable code and HTTP status', () => {
    const error = new AppError({
      code: 'validation_error',
      message: 'Invalid payload',
      statusCode: HttpStatus.BAD_REQUEST,
      details: {
        fieldErrors: {
          email: ['Invalid email'],
        },
      },
      exposeDetails: true,
    });

    expect(error.name).toBe('AppError');
    expect(error.code).toBe('validation_error');
    expect(error.message).toBe('Invalid payload');
    expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(error.exposeDetails).toBe(true);
    expect(error.details).toEqual({
      fieldErrors: {
        email: ['Invalid email'],
      },
    });
  });
});
