import { Controller, Get, Header } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { pathToSchema } from '../config';

@Controller('schema')
export class SchemaController {
  #schema: string;

  @Get('/')
  @Header('content-type', 'application/openapi+yaml')
  async getSchema(): Promise<string> {
    if (!Boolean(this.#schema)) {
      this.#schema = await readFile(pathToSchema, 'utf-8');
    }
    return this.#schema;
  }
}
