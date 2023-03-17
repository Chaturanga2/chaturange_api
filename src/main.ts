import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Add the ValidationPipe to the global scope of the app
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
