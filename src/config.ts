import { resolve as resolvePath } from 'node:path';

export const pathToSchema = resolvePath(
  __dirname,
  '..',
  'payroll-dates.openapi.yaml',
);
