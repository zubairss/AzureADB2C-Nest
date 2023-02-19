import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import rawBodyMiddleware from './common/middleware/rawBody.middleware';
import { EnvironmentVariables } from './env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(rawBodyMiddleware());
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const port = configService.get<number>('PORT');

  //TODO - SETUP MARIADB in AZURE & IN APP + TYPEORM CONFIG

  const options = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('API backend (NestJS)')
    .setVersion(`${process.env.NODE_ENV}`)
    .addBearerAuth()
    .addTag('health', 'Quickly returns the operational status of application')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);


  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
  }))
  app.enableCors();
  await app.listen(port);

  console.log(`Listening at http://localhost:${port}`);
  console.log(`Swagger at http://localhost:${port}/api/docs`);
}
bootstrap();
