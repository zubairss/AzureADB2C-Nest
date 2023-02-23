import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ErrorInterceptor } from './common/error.interceptor';
import rawBodyMiddleware from './common/middleware/rawBody.middleware';
import { AppEnvironment, EnvironmentVariables } from './env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(rawBodyMiddleware());
  const configService =
    app.get<ConfigService<EnvironmentVariables>>(ConfigService);
  const port = configService.get<number>('NODE_PORT');
  const environment = configService.get<AppEnvironment>('NODE_ENV')

  if (environment != AppEnvironment.Production) {
    const options = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription('API backend (NestJS)')
      .setVersion(`${process.env.NODE_ENV}`)
      .addBearerAuth()
      .addTag('health', 'Quickly returns the operational status of application')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);
  }


  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
  }))
  app.useGlobalInterceptors(new ErrorInterceptor())
  app.enableCors();
  await app.listen(port);

  console.log(`Listening at http://localhost:${port}`);
  console.log(`Swagger at http://localhost:${port}/api/docs`);
}
bootstrap();
