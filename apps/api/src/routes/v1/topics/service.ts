import { Inject, Injectable } from '@nestjs/common';
import { DBService } from '@sherlock/core';
import { CreateTopic, Topic, UpdateTopic } from '@sherlock/models';
import { MongoClient } from 'mongodb';

const COLLECTION_NAME = 'topics';

@Injectable()
export class TopicsService extends DBService<Topic, CreateTopic, UpdateTopic> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, COLLECTION_NAME);
  }
}
