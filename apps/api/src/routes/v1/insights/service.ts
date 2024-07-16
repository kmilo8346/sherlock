import { Inject, Injectable } from '@nestjs/common';
import { CreateInsight, Insight, UpdateInsight } from '@sherlock/models';
import { DBService } from 'apps/api/src/lib';
import { MongoClient } from 'mongodb';

@Injectable()
export class InsightsService extends DBService<
  Insight,
  CreateInsight,
  UpdateInsight
> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'insights');
  }
}
