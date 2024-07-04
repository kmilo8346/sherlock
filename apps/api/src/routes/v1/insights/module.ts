import { Module } from '@nestjs/common';

import { InsightsController } from './controller';
import { InsightsService } from './service';

@Module({
  imports: [],
  controllers: [InsightsController],
  providers: [InsightsService],
})
export class InsightsModule {}
