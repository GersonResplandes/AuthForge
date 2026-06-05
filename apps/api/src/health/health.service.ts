import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import nodemailer from 'nodemailer';
import pg from 'pg';

import { env } from '../env.js';

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
    const pool = new pg.Pool({
      connectionString: env.DATABASE_URL,
    });

    try {
      await pool.query('select 1');
      return { status: 'up' };
    } catch (error) {
      return this.down(error);
    } finally {
      await pool.end();
    }
  }

  private async checkRedis(): Promise<DependencyHealth> {
    const redis = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    redis.on('error', () => undefined);

    try {
      await redis.connect();
      await redis.ping();
      return { status: 'up' };
    } catch (error) {
      return this.down(error);
    } finally {
      redis.disconnect();
    }
  }

  private async checkMailpit(): Promise<DependencyHealth> {
    const transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: false,
    });

    try {
      await transporter.verify();
      return { status: 'up' };
    } catch (error) {
      return this.down(error);
    } finally {
      transporter.close();
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
