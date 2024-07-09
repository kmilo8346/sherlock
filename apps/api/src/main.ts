/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { JwtAuthGuard } from './lib';
import { RoutesModule } from './routes/module';

async function bootstrap() {
  const app = await NestFactory.create(RoutesModule);

  // Habilitar CORS
  app.enableCors({});

  // Este pipe valida parámetros que se
  // tipiaron con clases que usan class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Guard global que valida el token JWT
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
