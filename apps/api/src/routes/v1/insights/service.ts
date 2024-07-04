import { Injectable } from '@nestjs/common';

@Injectable()
export class InsightsService {
  getData(): { message: string } {
    return { message: 'Hello Insights' };
  }
}
