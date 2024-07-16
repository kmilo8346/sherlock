import { Inject, Injectable } from '@nestjs/common';
import {
  CreateSubscription,
  Subscription,
  UpdateSubscription,
} from '@sherlock/models';
import { DBService } from 'apps/api/src/lib';
import { MongoClient } from 'mongodb';

@Injectable()
export class SubscriptionsService extends DBService<
  Subscription,
  CreateSubscription,
  UpdateSubscription
> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'subscriptions');
  }
}
