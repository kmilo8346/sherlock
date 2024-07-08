import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class Topic {
  _id!: ObjectId;
  label!: string;
  query!: string;
  created_at!: string;
  updated_at!: string;
}

export class CreateTopic {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsNotEmpty()
  query!: string;
}

export class UpdateTopic {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsNotEmpty()
  query!: string;
}
