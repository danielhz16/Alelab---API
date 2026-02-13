import { loadEnvFile } from 'node:process';
loadEnvFile();


import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';


async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useBodyParser('json', { limit: '10kb' });
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.APP_UI,
    credentials: true,
  });
  app.enableShutdownHooks()
  await app.listen(process.env.PORT ?? 3000);

  Logger.log(`SERVIDOR EN: ${process.env.HOST}:${process.env.PORT}`);
}
bootstrap();
