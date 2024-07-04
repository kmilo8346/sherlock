/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { RoutesModule } from './routes/module';

async function bootstrap() {
  const app = await NestFactory.create(RoutesModule);

  // Este pipe valida parámetros que se
  // tipiaron con clases que usan class-validator
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
