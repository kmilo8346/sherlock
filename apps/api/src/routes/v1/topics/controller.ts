import { Controller, Get } from '@nestjs/common';

import { TopicsService } from './service';

@Controller('/v1/topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  getData() {
    return this.topicsService.getData();
  }
}
