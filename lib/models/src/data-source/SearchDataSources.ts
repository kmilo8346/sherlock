import { Type, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { SearchParams } from '../rest';

class Filter {
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
