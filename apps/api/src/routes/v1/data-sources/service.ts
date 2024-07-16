import { Inject, Injectable } from '@nestjs/common';
import {
  CreateDataSource,
  DataSource,
  UpdateDataSource,
} from '@sherlock/models';
import { DBService } from 'apps/api/src/lib';
import { MongoClient } from 'mongodb';

@Injectable()
export class DataSourcesService extends DBService<
  DataSource,
  CreateDataSource,
  UpdateDataSource
> {
  constructor(@Inject('MONGO_CLIENT') mongoClient: MongoClient) {
    super(mongoClient, 'data-sources');
  }
}
