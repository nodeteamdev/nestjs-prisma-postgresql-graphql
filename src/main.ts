import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import express from 'express';
import winston from 'winston';
import helmet from 'helmet';
import hpp from 'hpp';
import { WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';

async function bootstrap() {
  const instance = createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'application.log' }),
    ],
  });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });

  app.use(express.urlencoded({ extended: true, limit: '1kb' }));
  app.use(express.json({ limit: '1kb' }));
  app.use(helmet());
  app.use(hpp());

  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
