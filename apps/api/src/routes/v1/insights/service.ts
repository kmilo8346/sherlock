import { Inject, Injectable } from '@nestjs/common';
import { CreateInsight, Insight, UpdateInsight } from '@sherlock/models';
import { DBService } from '@sherlock/core';
import { MongoClient } from 'mongodb';

const COLLECTION_NAME = 'insights';

@Injectable()
export class InsightsService extends DBService<
  Insight,
  CreateInsight,
  UpdateInsight
> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, COLLECTION_NAME);
  }
}
