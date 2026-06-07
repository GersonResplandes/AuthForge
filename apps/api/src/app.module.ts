import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { LoggerModule } from './common/logger/logger.module.js';
import { RequestContextMiddleware } from './common/request-context/request-context.middleware.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { MailModule } from './mail/mail.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [LoggerModule, DatabaseModule, RedisModule, MailModule, HealthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
