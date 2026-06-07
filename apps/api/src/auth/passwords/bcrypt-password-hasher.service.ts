import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

export const PASSWORD_HASH_ROUNDS = 12;

@Injectable()
export class BcryptPasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
  }
}
