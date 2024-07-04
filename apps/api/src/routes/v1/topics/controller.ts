import { Body, Controller, Get, Post } from '@nestjs/common';

import { TopicsService } from './service';
import { CreateTopic } from '@sherlock/models';

@Controller('/v1/topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  getAll() {
    return this.topicsService.getAll();
  }

  @Post()
  create(@Body() createTopic: CreateTopic) {
    return this.topicsService.create(createTopic);
  }
}
