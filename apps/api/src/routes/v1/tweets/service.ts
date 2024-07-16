import { Inject, Injectable } from '@nestjs/common';
import { CreateTweet, Tweet, UpdateTweet } from '@sherlock/models';
import { DBService } from 'apps/api/src/lib';
import { MongoClient } from 'mongodb';

@Injectable()
export class TweetsService extends DBService<Tweet, CreateTweet, UpdateTweet> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'tweets');
  }
}
