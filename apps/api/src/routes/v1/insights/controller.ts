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

import { InsightsService } from './service';
import { CreateInsight, SearchParams, UpdateInsight } from '@sherlock/models';
import { BulkInsights } from 'lib/models/src/insight';

@Controller('/v1/insights')
export class InsightsController {
  constructor(private readonly service: InsightsService) {}

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Get('/')
  getAll(@Query() searchParams: SearchParams) {
    return this.service.getAll(searchParams);
  }

  @Post('/')
  create(@Body() createInsight: CreateInsight) {
    return this.service.create(createInsight);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateInsight: UpdateInsight) {
    return this.service.update(id, updateInsight);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post('/bulk')
  bulk(@Body() bulkInsights: BulkInsights) {
    return this.service.bulk(bulkInsights);
  }
}
