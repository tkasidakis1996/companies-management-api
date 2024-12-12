import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Companies API')
    .setDescription('API for managing companies')
    .setVersion('1.0')
    .addTag('companies') // Optional, for grouping endpoints
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('docs', app, document);

  // Start the server
  await app.listen(3000);
}

bootstrap();
