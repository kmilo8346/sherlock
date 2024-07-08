import { Body, Controller, Post } from '@nestjs/common';

import { Credentials } from '@sherlock/models';
import { AuthService } from './service';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/login')
  getById(@Body() credentials: Credentials) {
    return this.service.login(credentials);
  }
}
