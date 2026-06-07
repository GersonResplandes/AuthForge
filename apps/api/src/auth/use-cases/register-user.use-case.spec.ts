import { describe, expect, it, jest } from '@jest/globals';
import { UserStatus, type Prisma, type User } from '@prisma/client';

import { AppError } from '../../common/errors/app-error.js';
import type { UsersRepository } from '../../users/users.repository.js';
import type { BcryptPasswordHasher } from '../passwords/bcrypt-password-hasher.service.js';
import { PasswordPolicy } from '../passwords/password-policy.service.js';

import { RegisterUserUseCase } from './register-user.use-case.js';

const validInput = {
  name: 'Gerson Resplandes',
  email: 'gerson@example.com',
  password: 'StrongPass123!',
};

describe('RegisterUserUseCase', () => {
  it('registers a user with hashed password and pending email verification', async () => {
    const createdAt = new Date('2026-06-06T12:00:00.000Z');
    const usersRepositoryMock = createUsersRepositoryMock({
      findByEmailResult: null,
      createResult: {
        id: 'user-id',
        name: validInput.name,
        email: validInput.email,
        emailVerifiedAt: null,
        passwordHash: 'hashed-password',
        status: UserStatus.pending_email_verification,
        createdAt,
        updatedAt: createdAt,
      },
    });
    const passwordHasher = createPasswordHasherMock('hashed-password');
    const useCase = new RegisterUserUseCase(
      usersRepositoryMock.repository,
      new PasswordPolicy(),
      passwordHasher.repository,
    );

    await expect(useCase.execute(validInput)).resolves.toEqual({
      id: 'user-id',
      name: validInput.name,
      email: validInput.email,
      status: UserStatus.pending_email_verification,
      emailVerifiedAt: null,
      createdAt,
    });
    expect(passwordHasher.hash).toHaveBeenCalledWith(validInput.password);
    expect(usersRepositoryMock.create).toHaveBeenCalledWith({
      name: validInput.name,
      email: validInput.email,
      passwordHash: 'hashed-password',
      status: UserStatus.pending_email_verification,
    });
  });

  it('rejects invalid passwords before creating a user', async () => {
    const usersRepositoryMock = createUsersRepositoryMock({
      findByEmailResult: null,
      createResult: null,
    });
    const passwordHasher = createPasswordHasherMock('hashed-password');
    const useCase = new RegisterUserUseCase(
      usersRepositoryMock.repository,
      new PasswordPolicy(),
      passwordHasher.repository,
    );

    await expect(
      useCase.execute({
        ...validInput,
        password: 'weak',
      }),
    ).rejects.toMatchObject({
      code: 'weak_password',
      statusCode: 400,
    });
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('rejects duplicated email addresses', async () => {
    const existingUser = createUser();
    const usersRepositoryMock = createUsersRepositoryMock({
      findByEmailResult: existingUser,
      createResult: null,
    });
    const passwordHasher = createPasswordHasherMock('hashed-password');
    const useCase = new RegisterUserUseCase(
      usersRepositoryMock.repository,
      new PasswordPolicy(),
      passwordHasher.repository,
    );

    const result = useCase.execute(validInput);

    await expect(result).rejects.toBeInstanceOf(AppError);
    await expect(result).rejects.toMatchObject({
      code: 'email_already_registered',
      statusCode: 409,
    });
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepositoryMock.create).not.toHaveBeenCalled();
  });
});

function createUsersRepositoryMock(options: {
  findByEmailResult: User | null;
  createResult: User | null;
}): {
  repository: UsersRepository;
  findByEmail: jest.Mock<(email: string) => Promise<User | null>>;
  create: jest.Mock<(data: Prisma.UserCreateInput) => Promise<User>>;
} {
  const findByEmail = jest.fn<(email: string) => Promise<User | null>>();
  findByEmail.mockResolvedValue(options.findByEmailResult);

  const create = jest.fn<(data: Prisma.UserCreateInput) => Promise<User>>();
  if (options.createResult) {
    create.mockResolvedValue(options.createResult);
  }

  const repository = {
    findByEmail,
    create,
  } as unknown as UsersRepository;

  return {
    repository,
    findByEmail,
    create,
  };
}

function createPasswordHasherMock(hashResult: string): {
  repository: BcryptPasswordHasher;
  hash: jest.Mock<(password: string) => Promise<string>>;
} {
  const hash = jest.fn<(password: string) => Promise<string>>().mockResolvedValue(hashResult);

  return {
    repository: {
      hash,
    },
    hash,
  };
}

function createUser(): User {
  const createdAt = new Date('2026-06-06T12:00:00.000Z');

  return {
    id: 'existing-user-id',
    name: validInput.name,
    email: validInput.email,
    emailVerifiedAt: null,
    passwordHash: 'existing-hash',
    status: UserStatus.pending_email_verification,
    createdAt,
    updatedAt: createdAt,
  };
}
