import { Test, TestingModule } from '@nestjs/testing';
import { PayrollDatesService } from './payroll-dates.service';

describe('PayrollDatesService', () => {
  let service: PayrollDatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayrollDatesService],
    }).compile();

    service = module.get<PayrollDatesService>(PayrollDatesService);
  });

  it('should return expected values', () => {
    const result = service.getDates(new Date('2023-03-29T12:00:00.000Z'), 12);
    expect(result).toEqual([
      { date: '2023/03/31', type: 'base' },
      { date: '2023/04/19', type: 'bonus' },
      { date: '2023/04/28', type: 'base' },
      { date: '2023/05/15', type: 'bonus' },
      { date: '2023/05/31', type: 'base' },
      { date: '2023/06/15', type: 'bonus' },
      { date: '2023/06/30', type: 'base' },
      { date: '2023/07/19', type: 'bonus' },
      { date: '2023/07/31', type: 'base' },
      { date: '2023/08/15', type: 'bonus' },
      { date: '2023/08/31', type: 'base' },
      { date: '2023/09/15', type: 'bonus' },
      { date: '2023/09/29', type: 'base' },
      { date: '2023/10/18', type: 'bonus' },
      { date: '2023/10/31', type: 'base' },
      { date: '2023/11/15', type: 'bonus' },
      { date: '2023/11/30', type: 'base' },
      { date: '2023/12/15', type: 'bonus' },
      { date: '2023/12/29', type: 'base' },
      { date: '2024/01/15', type: 'bonus' },
      { date: '2024/01/31', type: 'base' },
      { date: '2024/02/15', type: 'bonus' },
      { date: '2024/02/29', type: 'base' },
    ]);
  });

  it('should return Wednesday 19 for bonus day in April 2023', () => {
    const result = service.getDates(new Date('2023-04-01T12:00:00.000Z'));
    expect(result.length).toBe(2);
    expect(new Date(result[0].date).getDate()).toBe(19);
    expect(new Date(result[0].date).getDay()).toBe(3);
    expect(result[0].type).toBe('bonus');
  });

  it('should return the 15th for bonus day in May 2023', () => {
    const result = service.getDates(new Date('2023-05-01T12:00:00.000Z'));
    expect(result.length).toBe(2);
    expect(new Date(result[0].date).getDate()).toBe(15);
    expect(new Date(result[0].date).getDay()).toBe(1);
    expect(result[0].type).toBe('bonus');
  });

  it('should return the 31st for base day in March 2023', () => {
    const result = service.getDates(new Date('2023-01-01T12:00:00.000Z'));
    expect(result.length).toBe(2);
    expect(new Date(result[1].date).getDate()).toBe(31);
    expect(result[1].type).toBe('base');
  });

  it('should return the 29th for base day in September 2023', () => {
    const result = service.getDates(new Date('2023-09-01T12:00:00.000Z'));
    expect(result.length).toBe(2);
    expect(new Date(result[1].date).getDate()).toBe(29);
    expect(new Date(result[1].date).getDay()).toBe(5);
    expect(result[1].type).toBe('base');
  });

  it('should return the 29th for base day in February 2024, which is a leap year', () => {
    const result = service.getDates(new Date('2024-02-01T12:00:00.000Z'));
    expect(result.length).toBe(2);
    expect(new Date(result[1].date).getDate()).toBe(29);
    expect(new Date(result[1].date).getDay()).toBe(4);
    expect(result[1].type).toBe('base');
  });
  it('should return the 28th for base day in February 2023, which is not a leap year', () => {
    const result = service.getDates(new Date('2023-02-01T12:00:00.000Z'));
    expect(result.length).toBe(2);
    expect(new Date(result[1].date).getDate()).toBe(28);
    expect(new Date(result[1].date).getDay()).toBe(2);
    expect(result[1].type).toBe('base');
  });

  it('should return base day as the first result if bonus day has passed', () => {
    const result = service.getDates(new Date('2023-03-20T12:00:00.000Z'));
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('base');
  });

  it('should return the bonus day in the next month even if it is shorter and the start date is the last day of the month', () => {
    const result = service.getDates(new Date('2023-03-31T12:00:00.000Z'), 12);
    expect(new Date(result[0].date).getDate()).toBe(19);
    expect(new Date(result[0].date).getDay()).toBe(3);
    expect(result[0].type).toBe('bonus');
  });
});
