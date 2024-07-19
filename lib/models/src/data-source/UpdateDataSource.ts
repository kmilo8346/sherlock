import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { QueryDataSource } from './QueryDataSource';

export class UpdateDataSource {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  label?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => QueryDataSource)
  queries?: QueryDataSource[];
}
