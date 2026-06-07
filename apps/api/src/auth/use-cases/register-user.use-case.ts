import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

import { AppError } from '../../common/errors/app-error.js';
import { UsersRepository } from '../../users/users.repository.js';
import { BcryptPasswordHasher } from '../passwords/bcrypt-password-hasher.service.js';
import { PasswordPolicy } from '../passwords/password-policy.service.js';

export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  emailVerifiedAt: Date | null;
  createdAt: Date;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordPolicy: PasswordPolicy,
    private readonly passwordHasher: BcryptPasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisteredUser> {
    this.passwordPolicy.validate(input.password);

    const existingUser = await this.usersRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError({
        code: 'email_already_registered',
        message: 'Email is already registered',
        statusCode: 409,
      });
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.usersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      status: UserStatus.pending_email_verification,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
    };
  }
}
