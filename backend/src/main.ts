// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({
//     credentials: true,
//     origin: ['http://localhost:3000'],
//   });
//   await app.listen(3005);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      credentials: true,
      origin: ['http://localhost:3000'],
    });
    await app.listen(3005);
    console.log('Application is running on port 3005');
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}
bootstrap();
