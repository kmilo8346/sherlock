import {
  CreateDataSource,
  DataSource,
  UpdateDataSource,
} from '@sherlock/models';
import { ICONFIG, RESTClient } from './RESTClient';

export class DataSourceClient extends RESTClient<
  DataSource,
  CreateDataSource,
  UpdateDataSource
> {
  constructor(config: ICONFIG) {
    super(config, 'data-sources');
  }
}
