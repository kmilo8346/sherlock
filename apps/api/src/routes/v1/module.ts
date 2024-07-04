import { Module } from '@nestjs/common';

import { MongoModule } from '@sherlock/core';
import { InsightsModule } from './insights/module';
import { TopicsModule } from './topics/module';

@Module({
  imports: [MongoModule, InsightsModule, TopicsModule],
  controllers: [],
  providers: [],
})
export class V1Module {}
