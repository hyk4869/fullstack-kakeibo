import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      credentials: true,
      origin: ['http://localhost:3000'],
    });

    //後でここを修正
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    await app.listen(3005);
    console.log('Application is running on port 3005');
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();
