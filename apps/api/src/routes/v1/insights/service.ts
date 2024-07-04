import { Injectable } from '@nestjs/common';
import { ICollection } from '@sherlock/core';
import { CreateInsight, Insight } from '@sherlock/models';

@Injectable()
export class InsightsService {
  async getAll(params: { topicId?: string }): Promise<ICollection<Insight>> {
    return {
      total: 5,
      from: 0,
      size: 5,
      data: [
        {
          _id: '1',
          topic_id: '1',
          slug: 'insight-1',
          content: 'Insight 1',
          stats: {
            tweets: 10,
            retweets: 20,
          },
          created_at: '2021-01-01T00:00:00Z',
          updated_at: '2021-01-01T00:00:00Z',
        },
      ],
    };
  }

  async create(createInsight: CreateInsight): Promise<Insight> {
    const insight: Insight = {
      ...createInsight,
      _id: '1',
      created_at: '2021-01-01T00:00:00Z',
      updated_at: '2021-01-01T00:00:00Z',
    };

    return insight;
  }
}
