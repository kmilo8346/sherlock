import { Module } from '@nestjs/common';

import { TopicsController } from './controller';
import { TopicsService } from './service';

@Module({
  imports: [],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
