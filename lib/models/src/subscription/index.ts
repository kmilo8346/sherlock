import { IsNotEmpty, IsString } from 'class-validator';

export class Subscription {
  _id!: string;
  user_id!: string;
  data_source_id!: string;
  label!: string;
  created_at!: string;
  updated_at!: string;
}

export class CreateSubscription {
  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  data_source_id!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;
}
