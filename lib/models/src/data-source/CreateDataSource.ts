import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { QueryDataSource } from './QueryDataSource';

export class CreateDataSource {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsBoolean()
  enabled: boolean = true;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QueryDataSource)
  queries!: QueryDataSource[];
}
