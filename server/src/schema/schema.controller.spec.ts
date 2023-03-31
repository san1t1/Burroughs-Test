import { Test, TestingModule } from '@nestjs/testing';
import { SchemaController } from './schema.controller';

describe('SchemaController', () => {
  let schemaController: SchemaController;
  let schemaModule: TestingModule;

  beforeAll(async () => {
    schemaModule = await Test.createTestingModule({
      controllers: [SchemaController],
    }).compile();

    schemaController = schemaModule.get<SchemaController>(SchemaController);
  });

  it('should return the raw schema', async () => {
    const result = await schemaController.getSchema();
    expect(result).toMatch(/^openapi: 3.0.3/);
  });
});
