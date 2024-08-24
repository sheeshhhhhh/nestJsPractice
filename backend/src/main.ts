import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Specify your frontend origin
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    credentials: true, // If you need to include cookies or auth headers
  });
  await app.listen(3000);
}
bootstrap();
