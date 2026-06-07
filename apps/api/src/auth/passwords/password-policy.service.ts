import { Injectable } from '@nestjs/common';

import { AppError } from '../../common/errors/app-error.js';

export type PasswordPolicyViolation = {
  rule: string;
  message: string;
};

@Injectable()
export class PasswordPolicy {
  validate(password: string): void {
    const violations = this.getViolations(password);

    if (violations.length > 0) {
      throw new AppError({
        code: 'weak_password',
        message: 'Password does not meet security requirements',
        statusCode: 400,
        details: {
          violations,
        },
        exposeDetails: true,
      });
    }
  }

  private getViolations(password: string): PasswordPolicyViolation[] {
    const violations: PasswordPolicyViolation[] = [];

    if (password.length < 12) {
      violations.push({
        rule: 'min_length',
        message: 'Password must contain at least 12 characters.',
      });
    }

    if (!/[a-z]/.test(password)) {
      violations.push({
        rule: 'lowercase',
        message: 'Password must contain at least one lowercase letter.',
      });
    }

    if (!/[A-Z]/.test(password)) {
      violations.push({
        rule: 'uppercase',
        message: 'Password must contain at least one uppercase letter.',
      });
    }

    if (!/[0-9]/.test(password)) {
      violations.push({
        rule: 'number',
        message: 'Password must contain at least one number.',
      });
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      violations.push({
        rule: 'symbol',
        message: 'Password must contain at least one symbol.',
      });
    }

    return violations;
  }
}
