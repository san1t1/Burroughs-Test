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

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(404)
      .expect({
        name: 'Not Found',
        status: 404,
        path: '/',
        errors: [{ path: '/', message: 'not found' }],
      });
  });

  it('correctly validates requests against the schema', () => {
    return request(app.getHttpServer())
      .get('/payroll-dates?unacceptable=query')
      .expect(400)
      .expect({
        name: 'Bad Request',
        status: 400,
        path: '/query/unacceptable',
        errors: [
          {
            path: '/query/unacceptable',
            message: "Unknown query parameter 'unacceptable'",
          },
        ],
      });
  });
});
