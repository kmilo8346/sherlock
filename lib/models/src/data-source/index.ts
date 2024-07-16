import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SearchParams } from '../rest';

export class DataSource {
  _id!: string;
  label!: string;
  enabled!: boolean;
  accounts!: {
    id: string;
    last_tweet_analyzed_at: string;
  }[];
  created_at!: string;
  updated_at!: string;
}

class Account {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  last_tweet_analyzed_at: string = new Date().toISOString();
}

export class CreateDataSource {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsBoolean()
  enabled: boolean = true;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Account)
  accounts!: Account[];
}

export class UpdateDataSource {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  label?: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Account)
  @IsOptional()
  accounts?: Account[];
}

export class Filter {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  enabled?: boolean;
}

export class SearchDataSources extends SearchParams {
  @IsOptional()
  @ValidateNested()
  @Type(() => Filter)
  override filter?: Filter;
}
