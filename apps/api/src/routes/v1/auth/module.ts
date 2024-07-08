import { Module } from '@nestjs/common';

import { AuthController } from './controller';
import { AuthService } from './service';
import { UsersModule } from '../users/module';
import { UsersService } from '../users/service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, ConfigService],
})
export class AuthModule {}
