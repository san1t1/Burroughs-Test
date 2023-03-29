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
      .get('/payroll-dates/2023/03/01?unacceptable=query')
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

  it('does not allow more than 10 years of data', () => {
    return request(app.getHttpServer())
      .get('/payroll-dates/2023/03/01?months=121')
      .expect(400)
      .expect({
        name: 'Bad Request',
        status: 400,
        path: '/',
        errors: [
          {
            path: '/query/months',
            message: 'must be <= 120',
            errorCode: 'maximum.openapi.validation',
          },
        ],
      });
  });
  it('does not allow queries before the year 2000', () => {
    return request(app.getHttpServer())
      .get('/payroll-dates/1999/03/01')
      .expect(400)
      .expect({
        name: 'Bad Request',
        status: 400,
        path: '/',
        errors: [
          {
            path: '/params/year',
            message: 'must match pattern "^2\\d{3}$"',
            errorCode: 'pattern.openapi.validation',
          },
        ],
      });
  });
  it.each(['2023/02/30', '2023/04/31'])(
    'does not allow invalid date %p',
    (date) => {
      return request(app.getHttpServer())
        .get(`/payroll-dates/${date}`)
        .expect(400);
    },
  );

  it('can retrieve data for 12 months by default', async () => {
    const response = await request(app.getHttpServer()).get(
      '/payroll-dates/2023/03/29',
    );
    expect(response.status).toBe(200);
    expect(response.headers).toHaveProperty(
      'content-type',
      'text/csv; charset=utf-8',
    );
    expect(response.text.split('\n').length).toBe(24);
  });

  it('can retrieve data for 24 months of data as json', async () => {
    const response = await request(app.getHttpServer())
      .get('/payroll-dates/2023/03/29?months=24')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.headers).toHaveProperty(
      'content-type',
      'application/json; charset=utf-8',
    );
    const data = JSON.parse(response.text);
    expect(data.length).toBe(47);
  });
});
