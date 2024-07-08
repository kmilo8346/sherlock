import { Inject, Injectable } from '@nestjs/common';
import { DBClient } from '@sherlock/core';
import { Insight } from '@sherlock/models';
import { MongoClient } from 'mongodb';

@Injectable()
export class InsightsService extends DBClient<Insight> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'insights');
  }
}
