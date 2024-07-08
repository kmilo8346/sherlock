import { Body, Controller, Post } from '@nestjs/common';

import { Credentials } from '@sherlock/models';
import { AuthService } from './service';
import { Public } from '../../../lib';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('/login')
  getById(@Body() credentials: Credentials) {
    return this.service.login(credentials);
  }
}
