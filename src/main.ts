import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: {
    origin: true,
    methods: ['PUT', 'POST', 'GET', 'DELETE']
  } });
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.use(rateLimit({
    windowMs: 1000, // 1 segundo window
    max: 10, // start blocking after 5 requests
    message: 'Muitas requisições estão sendo feitas por este IP. Espere 15 minutos para voltar a efetuar',
  }));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(3000);
}
bootstrap();
