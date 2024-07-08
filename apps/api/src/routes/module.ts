import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MongoModule } from '../lib';
import { V1Module } from './v1/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    V1Module,
  ],
  controllers: [],
  providers: [],
})
export class RoutesModule {}
