import {
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { createDocument, swaggerCustomOptions } from './configs/swagger';
import { ResponseFilter } from './response/response.filter';
import { corsConfig } from './utils';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);

  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Api-Version',
    defaultVersion: VERSION_NEUTRAL,
  });

  const port = process.env.PORT;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new ResponseFilter());

  SwaggerModule.setup(
    'swagger',
    app,
    createDocument(app),
    swaggerCustomOptions,
  );

  const baseUrl = process.env.BASE_URL;
  await app.listen(port, () => {
    console.info('[SWAGGER]', `${baseUrl}/swagger`);
    console.info('[ENV]', process.env.NODE_ENV);
  });
}

bootstrap();
