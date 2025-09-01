import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Allow all origins since you only have Swagger
  app.enableCors({
    origin: true, // Allow ALL origins
  });

  const swagger = new DocumentBuilder()
    .setTitle('nest js course-api')
    .setDescription('E-commerce API')
    .addServer(process.env.API_URL || 'http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-service')
    .setLicense('MIT license', 'google.com')
    .setVersion('1.0')
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .addBearerAuth()
    .build();

  const documentation = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, documentation);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
