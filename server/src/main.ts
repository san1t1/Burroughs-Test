import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as YAML from 'yamljs';
import * as express from 'express';
import {
  serve as serveSwagger,
  setup as setupSwagger,
} from 'swagger-ui-express';
import { pathToSchema, pathToStaticAssets } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/api-docs', serveSwagger, setupSwagger(YAML.load(pathToSchema)));
  app.use('/', express.static(pathToStaticAssets));

  await app.listen(5000);
}
bootstrap();
