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
  app.useStaticAssets(join(__dirname, '../..', 'uploads/MenuPhoto'), {
    prefix: '/MenuPhoto'
  })

  app.enableCors({
    origin: process.env.CLIENT_BASE_URL, // Specify your frontend origin
    methods: 'GET,POST,PUT,DELETE,PATCH', // Allowed methods
    credentials: true, // If you need to include cookies or auth headers
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
