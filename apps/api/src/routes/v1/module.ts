import { Module } from '@nestjs/common';

import { AuthModule } from './auth/module';
import { DataSourcesModule } from './data-sources/module';
import { InsightsModule } from './insights/module';
import { UsersModule } from './users/module';
import { SubscriptionsModule } from './subscriptions/module';

@Module({
  imports: [
    AuthModule,
    DataSourcesModule,
    InsightsModule,
    UsersModule,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
