import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { env } from './env.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: env.API_CORS_ORIGIN,
  });

  await app.listen(env.API_PORT);
}

void bootstrap();
