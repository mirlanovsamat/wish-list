import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResourceIdToNumberInterceptor } from './common/interceptors/resource-id-to-number.interceptor';
import { getAppConfig } from './common/configs/app.config';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  const logger = new Logger();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: ['error', 'warn', 'log', 'debug'],
    },
  );

  const appConfig = getAppConfig();

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: 10000000,
      files: 10,
      headerPairs: 2000,
      parts: 1000,
    },
  });
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );
  app.useGlobalInterceptors(new ResourceIdToNumberInterceptor());
  app.enableShutdownHooks();

  const documentConfig = new DocumentBuilder()
    .setTitle('Wish List Swagger')
    .setDescription('Documentation of Wish List')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const options = {
    customCss:
      '.swagger-ui section.models, .response-control-media-type { display: none; }',
  };

  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, documentConfig),
    options,
  );

  await app.listen(appConfig.port, '0.0.0.0', () => {
    logger.debug(`Service available on port ${appConfig.port}`);
  });
}

bootstrap();
