import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CreateSubscription, SearchParams } from '@sherlock/models';
import { SubscriptionsService } from './service';

@Controller('/v1/subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Get('/')
  getAll(@Query() searchParams: SearchParams) {
    return this.service.getAll(searchParams);
  }

  @Post('/')
  create(@Body() createSubscription: CreateSubscription) {
    return this.service.create(createSubscription);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
