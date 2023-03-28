import { resolve as resolvePath } from 'node:path';

export const pathToSchema = resolvePath(
  __dirname,
  '..',
  'payroll-dates.openapi.yaml',
);

export const isProduction = process.env.NODE_ENV === 'production';
