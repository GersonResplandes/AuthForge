import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ZodValidationPipe } from '../../common/validation/zod-validation.pipe.js';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case.js';

import { registerUserSchema, type RegisterUserBody } from './schemas/register-user.schema.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User registered with pending email verification status.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload or weak password.',
  })
  @ApiConflictResponse({
    description: 'Email is already registered.',
  })
  async register(
    @Body(new ZodValidationPipe(registerUserSchema)) body: RegisterUserBody,
  ): Promise<RegisterUserResponse> {
    const user = await this.registerUserUseCase.execute(body);

    return {
      user,
    };
  }
}

type RegisterUserResponse =
  Awaited<ReturnType<RegisterUserUseCase['execute']>> extends infer User
    ? {
        user: User;
      }
    : never;
