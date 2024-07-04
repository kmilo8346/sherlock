import { Controller, Get } from '@nestjs/common';

import { InsightsService } from './service';

@Controller('/v1/insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  getData() {
    return this.insightsService.getData();
  }
}
