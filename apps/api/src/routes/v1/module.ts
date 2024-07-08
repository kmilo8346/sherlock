import { Module } from '@nestjs/common';

import { InsightsModule } from './insights/module';
import { TopicsModule } from './topics/module';

@Module({
  imports: [InsightsModule, TopicsModule],
  controllers: [],
  providers: [],
})
export class V1Module {}
