import { Inject, Injectable } from '@nestjs/common';
import { DBClient } from '@sherlock/core';
import { DataSource } from '@sherlock/models';
import { MongoClient } from 'mongodb';

@Injectable()
export class TweetsService extends DBClient<DataSource> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'tweets');
  }
}
