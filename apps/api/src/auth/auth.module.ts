import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module.js';

import { AuthController } from './http/auth.controller.js';
import { BcryptPasswordHasher } from './passwords/bcrypt-password-hasher.service.js';
import { PasswordPolicy } from './passwords/password-policy.service.js';
import { RegisterUserUseCase } from './use-cases/register-user.use-case.js';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [PasswordPolicy, BcryptPasswordHasher, RegisterUserUseCase],
})
export class AuthModule {}
