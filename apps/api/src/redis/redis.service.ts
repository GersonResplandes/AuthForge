import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

import { env } from '../env.js';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  onModuleInit(): void {
    this.client.on('error', () => undefined);
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }

  async ping(): Promise<void> {
    if (this.client.status === 'end' || this.client.status === 'close') {
      await this.client.connect();
    }

    await this.client.ping();
  }

  getClient(): Redis {
    return this.client;
  }
}
