import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config/config.keys';
import { getConfigValues } from './config/configuration';

async function bootstrap() {
  const response = await getConfigValues();

  console.log('secrets pulled', response);
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      preflightContinue: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>(CONFIG_KEYS.PORT) || 3000;

  app.setGlobalPrefix('settings/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist:true,
      forbidNonWhitelisted: true,
      // transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('DigiLog Settings API Documentation')
    .setDescription('The DigiLog API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional: just a hint for Swagger UI
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // This name is used in the decorator below
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('settings/api/docs', app, document);
  await app.listen(port);
}
bootstrap();
