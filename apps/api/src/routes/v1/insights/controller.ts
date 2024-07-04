import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { InsightsService } from './service';
import { CreateInsight } from '@sherlock/models';

@Controller('/v1/insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  getAll(@Query('topicId') topicId: string | undefined) {
    return this.insightsService.getAll({
      topicId,
    });
  }

  @Post()
  create(@Body() createInsight: CreateInsight) {
    return this.insightsService.create(createInsight);
  }
}
