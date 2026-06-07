import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/errors/http-exception.filter.js';
import { AppLogger } from './common/logger/app-logger.service.js';
import { ZodValidationPipe } from './common/validation/zod-validation.pipe.js';
import { env } from './env.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(AppLogger);

  app.useLogger(logger);
  app.use(helmet());

  app.enableCors({
    origin: env.API_CORS_ORIGIN,
    credentials: true,
  });

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('AuthForge API')
      .setDescription(
        'Educational identity platform API for SaaS authentication and authorization.',
      )
      .setVersion('0.1.0')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('docs', app, document);

  await app.listen(env.API_PORT);
  logger.info('AuthForge API started', {
    port: env.API_PORT,
    docsPath: '/docs',
  });
}

void bootstrap();
