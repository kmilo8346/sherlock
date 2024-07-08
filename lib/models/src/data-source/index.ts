import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DataSource {
  _id!: string;
  label!: string;
  query!: string;
  created_at!: string;
  updated_at!: string;
}

export class CreateDataSource {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsNotEmpty()
  query!: string;
}

export class UpdateDataSource {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  label!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  query!: string;
}
