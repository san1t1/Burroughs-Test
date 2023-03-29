import { Injectable } from '@nestjs/common';

export type PaymentType = 'base' | 'bonus';

export type PayrollDate = {
  type: PaymentType;
  date: Date;
};

const SUNDAY = 0;
const SATURDAY = 6;
const AROUND_NOON = 12;

const getBonusDateForMonth = (date: Date): Date => {
  const bonusDate = new Date(date);
  bonusDate.setDate(15);
  const day = bonusDate.getDay();
  if (day === SATURDAY) {
    bonusDate.setDate(bonusDate.getDate() + 4);
  } else if (day === SUNDAY) {
    bonusDate.setDate(bonusDate.getDate() + 3);
  }
  bonusDate.setHours(AROUND_NOON);
  return bonusDate;
};

const getBaseDateForMonth = (date: Date): Date => {
  const baseDate = new Date(date);
  baseDate.setDate(1); // Avoids edge cases on the 31st day of some months when adding months
  baseDate.setMonth(date.getMonth() + 1);
  baseDate.setDate(0); // this persuades javascript to go back to the last day of the previous month
  baseDate.setHours(12);
  const day = baseDate.getDay();
  if (day === SATURDAY) {
    baseDate.setDate(baseDate.getDate() - 1);
  } else if (day === SUNDAY) {
    baseDate.setDate(baseDate.getDate() - 2);
  }
  return baseDate;
};

const addMonthsToDate = (date: Date, months = 0): Date => {
  const yearsToAdd = Math.floor(months / 12);
  const monthsToAdd = months % 12;
  return new Date(
    Date.UTC(
      date.getUTCFullYear() + yearsToAdd,
      date.getUTCMonth() + monthsToAdd,
      date.getUTCDate(),
      AROUND_NOON,
    ),
  );
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const formatDate = (date: Date): string => {
  const [{ value: month }, , { value: day }, , { value: year }] =
    dateFormatter.formatToParts(date);
  return `${year}/${month}/${day}`;
};

@Injectable()
export class PayrollDatesService {
  getDates(startDate: Date, months = 0): PayrollDate[] {
    const output = [];
    const beginAt = new Date(startDate);
    beginAt.setDate(1);
    for (let i = 0; i <= Math.max(months - 1, 0); i += 1) {
      const month = addMonthsToDate(new Date(beginAt), i);
      const bonusDate = getBonusDateForMonth(month);
      const baseDate = getBaseDateForMonth(month);
      if (bonusDate >= startDate) {
        output.push({
          date: formatDate(bonusDate),
          type: 'bonus',
        });
      }
      if (baseDate >= startDate) {
        output.push({
          date: formatDate(baseDate),
          type: 'base',
        });
      }
    }
    return output;
  }
}
