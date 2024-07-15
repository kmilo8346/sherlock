import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreateAccount, SearchParams, UpdateAccount } from '@sherlock/models';
import { AccountsService } from './service';

@Controller('/v1/accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Get('/')
  getAll(@Query() searchParams: SearchParams) {
    return this.service.getAll(searchParams);
  }

  @Post('/')
  create(@Body() createAccount: CreateAccount) {
    return this.service.create<CreateAccount>(createAccount);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateAccount: UpdateAccount) {
    return this.service.update<UpdateAccount>(id, updateAccount);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
