import { Inject, Injectable } from '@nestjs/common';
import { DBClient } from '@sherlock/core';
import { User } from '@sherlock/models';
import { MongoClient } from 'mongodb';

@Injectable()
export class UsersService extends DBClient<User> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'users');
  }
}
