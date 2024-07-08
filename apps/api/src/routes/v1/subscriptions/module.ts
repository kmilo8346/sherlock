import { Module } from '@nestjs/common';

import { SubscriptionsController } from './controller';
import { SubscriptionsService } from './service';

@Module({
  imports: [],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
