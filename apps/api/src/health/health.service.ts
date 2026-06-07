import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { RedisService } from '../redis/redis.service.js';

type DependencyStatus = 'up' | 'down';

type DependencyHealth = {
  status: DependencyStatus;
  message?: string;
};

export type HealthResponse = {
  status: 'ok' | 'error';
  service: 'authforge-api';
  dependencies: {
    postgres: DependencyHealth;
    redis: DependencyHealth;
    mailpit: DependencyHealth;
  };
};

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly mail: MailService,
  ) {}

  async check(): Promise<HealthResponse> {
    const [postgres, redis, mailpit] = await Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
      this.checkMailpit(),
    ]);

    const status = [postgres, redis, mailpit].every((dependency) => dependency.status === 'up')
      ? 'ok'
      : 'error';

    return {
      status,
      service: 'authforge-api',
      dependencies: {
        postgres,
        redis,
        mailpit,
      },
    };
  }

  private async checkPostgres(): Promise<DependencyHealth> {
    try {
      await this.prisma.ping();
      return { status: 'up' };
    } catch (error) {
      return this.down(error);
    }
  }

  private async checkRedis(): Promise<DependencyHealth> {
    try {
      await this.redis.ping();
      return { status: 'up' };
    } catch (error) {
      return this.down(error);
    }
  }

  private async checkMailpit(): Promise<DependencyHealth> {
    try {
      await this.mail.verifyConnection();
      return { status: 'up' };
    } catch (error) {
      return this.down(error);
    }
  }

  private down(error: unknown): DependencyHealth {
    return {
      status: 'down',
      message:
        error instanceof Error && error.message.length > 0
          ? error.message
          : 'Unknown healthcheck error',
    };
  }
}
