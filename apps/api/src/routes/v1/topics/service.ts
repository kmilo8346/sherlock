import { Injectable } from '@nestjs/common';
import { CreateTopic, Topic } from '@sherlock/models';
import { ICollection } from '@sherlock/core';

@Injectable()
export class TopicsService {
  async getAll(): Promise<ICollection<Topic>> {
    return {
      total: 5,
      from: 0,
      size: 5,
      data: [
        {
          _id: '1',
          label: 'Topic 1',
          query: 'Query 1',
          created_at: '2021-01-01T00:00:00Z',
          updated_at: '2021-01-01T00:00:00Z',
        },
      ],
    };
  }

  async create(createTopic: CreateTopic): Promise<Topic> {
    return {
      ...createTopic,
      _id: '1',
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z',
    };
  }
}
