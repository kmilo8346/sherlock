import { Injectable } from '@nestjs/common';

@Injectable()
export class TopicsService {
  getData(): { message: string } {
    return { message: 'Hello Topics' };
  }
}
