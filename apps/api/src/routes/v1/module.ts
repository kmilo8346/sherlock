import { Module } from '@nestjs/common';

import { DataSourcesModule } from './data-sources/module';
import { InsightsModule } from './insights/module';
import { UsersModule } from './users/module';
import { SubscriptionsModule } from './subscriptions/module';

@Module({
  imports: [
    DataSourcesModule,
    InsightsModule,
    UsersModule,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
