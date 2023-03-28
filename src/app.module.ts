import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchemaController } from './schema/schema.controller';

@Module({
  imports: [],
  controllers: [AppController, SchemaController],
  providers: [AppService],
})
export class AppModule {}
