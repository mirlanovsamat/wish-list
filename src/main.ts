import {
  BadRequestException,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getAppConfig } from './common/configs/app.config';

async function bootstrap() {
  const appConfig = getAppConfig();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({}),
    {
      bufferLogs: true,
    },
  );

  const logger = new Logger();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result[0].message);
      },
    }),
  );

  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('Shuffle Auth API')
    .setDescription('Documentation of Shuffle Auth API')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const options = {
    customCss:
      '.swagger-ui section.models, .response-control-media-type { display: none; }',
  };

  SwaggerModule.setup('docs', app, document, options);

  logger.debug('Swagger documentation has been initialized');

  await app.listen(appConfig.port, '0.0.0.0', () => {
    logger.debug(`Service available on port ${appConfig.port}`);
  });
}

bootstrap();
