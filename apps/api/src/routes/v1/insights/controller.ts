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
    return this.service.create<CreateInsight>(createInsight);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateInsight: UpdateInsight) {
    return this.service.update<UpdateInsight>(id, updateInsight);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
