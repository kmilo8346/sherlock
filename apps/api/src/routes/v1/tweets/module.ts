import { Module } from '@nestjs/common';

import { TweetsController } from './controller';
import { TweetsService } from './service';

@Module({
  imports: [],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}
