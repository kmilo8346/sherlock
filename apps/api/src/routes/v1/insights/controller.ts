import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

import { InsightsService } from './service';
import { CreateInsight, UpdateInsight } from '@sherlock/models';

@Controller('/v1/insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.insightsService.getById(id);
  }

  @Get()
  getAll(@Query('topicId') topicId: string | undefined) {
    return this.insightsService.getAll({
      query: {
        topic_id: topicId,
      },
    });
  }

  @Post()
  create(@Body() createInsight: CreateInsight) {
    return this.insightsService.create(createInsight);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateInsight: UpdateInsight) {
    return this.insightsService.update(id, updateInsight);
  }
}
