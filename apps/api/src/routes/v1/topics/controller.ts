import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { TopicsService } from './service';
import { CreateTopic, UpdateTopic } from '@sherlock/models';

@Controller('/v1/topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.topicsService.getById(id);
  }

  @Get()
  getAll() {
    return this.topicsService.getAll({});
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
