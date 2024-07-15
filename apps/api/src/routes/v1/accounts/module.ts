import { Module } from '@nestjs/common';

import { AccountsController } from './controller';
import { AccountsService } from './service';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
