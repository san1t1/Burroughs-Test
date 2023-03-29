import {
  Controller,
  Get,
  Query,
  Param,
  Res,
  Req,
  Logger,
} from '@nestjs/common';
import { PayrollDatesService } from './payroll-dates.service';
import { Request, Response } from 'express';
import { isProduction } from '../config';

const BAD_REQUEST = 400;
const NOT_ACCEPTABLE = 406;

@Controller('payroll-dates')
export class PayrollDatesController {
  constructor(private readonly payrollDatesService: PayrollDatesService) {}
  private readonly logger = new Logger(PayrollDatesController.name);

  @Get('/:year/:month/:day')
  getDates(
    @Param('year') year: number,
    @Param('month') month: number,
    @Param('day') day: number,
    @Res() res: Response,
    @Req() req: Request,
    @Query('months') months = 12, // this is limited to 120 months by api validation
  ): void {
    const returnJson = req.accepts('application/json');
    const returnCsv = req.accepts('text/csv') || !req.headers.accept;
    if (!returnCsv && !returnJson) {
      res.status(NOT_ACCEPTABLE).end();
      return;
    }
    const startDate = new Date(year, month - 1, day, 12);
    if (startDate.getMonth() !== month - 1) {
      res.status(BAD_REQUEST).end();
      return;
    }
    if (isProduction) {
      // the result of the API for a particular request will never change.
      // so browsers get to cache the result forever, with no network trips required
      // for validation
      res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
    }
    const entries = this.payrollDatesService.getDates(startDate, months);
    if (returnCsv) {
      // the spec asks for csv as the default
      res.header('content-type', 'text/csv');
      entries.forEach(({ date, type }) => res.write(`${date},${type}\n`));
      res.end();
    } else {
      res.json(entries);
    }
    this.logger.log(`GET /payroll-dates/${year}/${month}/${day}`);
  }
}
