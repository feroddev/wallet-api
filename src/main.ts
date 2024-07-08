import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  // app.enableCors({
  //   origin: ['http://localhost:3000', 'https://wallet-web-six.vercel.app'],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // });
  app.use(cors({
    origin: ['http://localhost:3000', 'https://wallet-web-six.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }))
  await app.listen(3001);
}
bootstrap();
