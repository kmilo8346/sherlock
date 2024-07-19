import { QueryDataSource } from './QueryDataSource';

export class DataSource {
  _id!: string;
  label!: string;
  enabled!: boolean;
  queries!: QueryDataSource[];
  created_at!: string;
  updated_at!: string;
}
