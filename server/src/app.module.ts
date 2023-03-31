import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import * as OpenApiValidator from 'express-openapi-validator';
import { SchemaController } from './schema/schema.controller';
import { OpenApiExceptionFilter } from './filters/openapi-exception.filter';
import { isProduction, pathToSchema } from './config';
import { PayrollDatesController } from './payroll-dates/payroll-dates.controller';
import { PayrollDatesService } from './payroll-dates/payroll-dates.service';

@Module({
  controllers: [SchemaController, PayrollDatesController],
  providers: [
    { provide: APP_FILTER, useClass: OpenApiExceptionFilter },
    PayrollDatesService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ...OpenApiValidator.middleware({
          apiSpec: pathToSchema,
          validateRequests: {
            allowUnknownQueryParameters: false,
            coerceTypes: false,
          },
          validateResponses: !isProduction,
          validateFormats: true,
        }),
      )
      .forRoutes('*');
  }
}
