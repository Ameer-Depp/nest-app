import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enhanced CORS configuration
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-HTTP-Method-Override',
    ],
    credentials: true,
  });

  // Require API_URL to be set in environment variables
  if (!process.env.API_URL) {
    throw new Error('API_URL environment variable must be set');
  }
  const baseUrl = process.env.API_URL;

  const swagger = new DocumentBuilder()
    .setTitle('NestJS Course API')
    .setDescription('E-commerce API')
    .addServer(baseUrl)
    .setTermsOfService(`${baseUrl}/terms-service`)
    .setLicense('MIT license', 'https://opensource.org/licenses/MIT')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const documentation = SwaggerModule.createDocument(app, swagger);

  // Setup Swagger with custom options
  SwaggerModule.setup('swagger', app, documentation, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
    customSiteTitle: 'NestJS API Documentation',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${baseUrl}`);
  console.log(`Swagger documentation available at: ${baseUrl}/swagger`);
}

void bootstrap();
