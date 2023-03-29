import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api-docs/schema (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/schema');
    expect(response.status).toBe(200);
    expect(response.headers).toHaveProperty(
      'content-type',
      'application/openapi+yaml; charset=utf-8',
    );
    expect(response.text).toMatch(/^openapi: 3.0.3/);
  });
});
