import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

import { CreateTweet, SearchParams } from '@sherlock/models';
import { TweetsService } from './service';

@Controller('/v1/tweets')
export class TweetsController {
  constructor(private readonly service: TweetsService) {}

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Get('/')
  getAll(@Query() searchParams: SearchParams) {
    return this.service.getAll(searchParams);
  }

  @Post('/')
  create(@Body() createTweet: CreateTweet) {
    return this.service.create<CreateTweet>(createTweet);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
