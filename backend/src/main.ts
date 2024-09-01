import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  app.useStaticAssets(join(__dirname, '../..', 'uploads/Avatar'), {
    prefix: '/public/',
  });
  app.useStaticAssets(join(__dirname, '../..', 'uploads/RestaurantHeaderPhoto'), {
    prefix: '/HeaderPhoto'
  })

  app.enableCors({
    origin: 'http://localhost:5173', // Specify your frontend origin
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    credentials: true, // If you need to include cookies or auth headers
  });
  await app.listen(3000);
}
bootstrap();
