import { Inject, Injectable } from '@nestjs/common';
import { DBClient } from '@sherlock/core';
import { Topic } from '@sherlock/models';
import { MongoClient } from 'mongodb';

const COLLECTION_NAME = 'topics';

@Injectable()
export class TopicsService extends DBClient<Topic> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, COLLECTION_NAME);
  }
}
