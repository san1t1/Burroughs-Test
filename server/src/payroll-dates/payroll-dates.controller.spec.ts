import { Test, TestingModule } from '@nestjs/testing';
import { PayrollDatesController } from './payroll-dates.controller';
import { Request, Response } from 'express';
import { PayrollDatesService } from './payroll-dates.service';

const getMockRequest = (acceptType?: string): Request => {
  return {
    headers: { accept: acceptType },
    accepts: (negotiated) => negotiated === acceptType,
  } as Request;
};

const getMockResponse = () => {
  const bodyParts = [];
  const headers = {};
  let statusCode = 200;
  const response: Response = {
    status: (code: number): Response => {
      statusCode = code;
      return response;
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    end: () => {},
    json: (data): Response => {
      bodyParts.push(JSON.stringify(data));
      return response;
    },
    write: (data: any): boolean => {
      bodyParts.push(data);
      return true;
    },
    header: (key: string, value?: string | string[]): Response => {
      headers[key] = value;
      return response;
    },
  } as Response;
  return {
    response,
    headers,
    get status() {
      return statusCode;
    },
    get body() {
      return bodyParts.join('');
    },
  };
};

describe('PayrollDatesController', () => {
  let payrollController: PayrollDatesController;
  let payrollModule: TestingModule;

  beforeEach(async () => {
    payrollModule = await Test.createTestingModule({
      controllers: [PayrollDatesController],
      providers: [PayrollDatesService],
    }).compile();

    payrollController = payrollModule.get<PayrollDatesController>(
      PayrollDatesController,
    );
  });

  it('should return data as csv by default, for the following 12 months', async () => {
    const request: Request = getMockRequest();
    const response = getMockResponse();

    await payrollController.getDates(2023, 3, 1, response.response, request);
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  it('should return data as csv by default, for the five years from the start of April 2024', async () => {
    const request: Request = getMockRequest();
    const response = getMockResponse();

    await payrollController.getDates(
      2024,
      4,
      1,
      response.response,
      request,
      60,
    );
    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  it('should return 406 when xml is requested', async () => {
    const request: Request = getMockRequest('application/xml');
    const response = getMockResponse();

    await payrollController.getDates(2023, 3, 1, response.response, request);
    expect(response.status).toBe(406);
  });

  it('should return data as json when requested - limited to the current month', async () => {
    const request: Request = getMockRequest('application/json');
    const response = getMockResponse();

    await payrollController.getDates(2023, 3, 1, response.response, request, 0);
    expect(response.status).toBe(200);
    const data = JSON.parse(response.body);
    expect(data.length).toBe(2);
    expect(data[0].type).toBe('bonus');
    expect(data[1].type).toBe('base');
  });
});
