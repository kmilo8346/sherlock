import { Module } from '@nestjs/common';

import { AuthModule } from './auth/module';
import { AccountsModule } from './accounts/module';
import { TweetsModule } from './tweets/module';
import { DataSourcesModule } from './data-sources/module';
import { InsightsModule } from './insights/module';
import { UsersModule } from './users/module';
import { SubscriptionsModule } from './subscriptions/module';

@Module({
  imports: [
    AuthModule,
    AccountsModule,
    TweetsModule,
    DataSourcesModule,
    InsightsModule,
    UsersModule,
    SubscriptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class V1Module {}
