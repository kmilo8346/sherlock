import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchParams {
  @IsOptional()
  filter?: Record<string, any>;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  from?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  size?: number;
}

export interface ICollection<T> {
  total: number;
  from: number;
  size: number;
  data: T[];
}
