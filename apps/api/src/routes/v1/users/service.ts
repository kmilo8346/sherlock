import { Inject, Injectable } from '@nestjs/common';
import { CreateUser, UpdateUser, User } from '@sherlock/models';
import { DBService } from 'apps/api/src/lib';
import { MongoClient } from 'mongodb';

@Injectable()
export class UsersService extends DBService<User, CreateUser, UpdateUser> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'users');
  }
}
