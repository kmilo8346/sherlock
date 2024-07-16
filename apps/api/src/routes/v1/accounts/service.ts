import { Inject, Injectable } from '@nestjs/common';
import { Account, CreateAccount, UpdateAccount } from '@sherlock/models';
import { DBService } from 'apps/api/src/lib';
import { MongoClient } from 'mongodb';

@Injectable()
export class AccountsService extends DBService<
  Account,
  CreateAccount,
  UpdateAccount
> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'accounts');
  }
}
