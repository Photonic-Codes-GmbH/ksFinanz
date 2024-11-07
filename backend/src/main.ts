import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app/app.module';
import { ConfigService } from './app/core/services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['debug', 'error', 'fatal', 'log', 'warn'] });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.config.backend.prefix);
  
  await app.listen(configService.config.backend.port);
}

bootstrap();
