import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  });

  const swagger = new DocumentBuilder()
    .setTitle('nest js course-api')
    .setDescription('E-commerce API')
    .addServer('http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-service')
    .setLicense('MIT license', 'google.com')
    .setVersion('1.0')
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .addBearerAuth()
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);

  // 'http://localhost:3000/swagger'
  SwaggerModule.setup('swagger', app, documentation);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
