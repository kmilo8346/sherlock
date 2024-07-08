import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { TopicsService } from './service';
import { CreateTopic, SearchParams, UpdateTopic } from '@sherlock/models';

@Controller('/v1/topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.topicsService.getById(id);
  }

  @Get()
  getAll(@Query() searchParams: SearchParams) {
    return this.topicsService.getAll(searchParams);
  }

  @Post()
  create(@Body() createTopic: CreateTopic) {
    return this.topicsService.create(createTopic);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateTopic: UpdateTopic) {
    return this.topicsService.update(id, updateTopic);
  }
}
