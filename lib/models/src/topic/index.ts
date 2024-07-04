import { IsNotEmpty, IsString } from 'class-validator';

export class Topic {
  _id!: string;
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
