import { Module } from '@nestjs/common';

import { DataSourcesController } from './controller';
import { DataSourcesService } from './service';

@Module({
  imports: [],
  controllers: [DataSourcesController],
  providers: [DataSourcesService],
})
export class DataSourcesModule {}
