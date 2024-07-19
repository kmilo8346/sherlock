import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';

export class QueryDataSource {
  @IsNotEmpty()
  @IsString()
  @IsIn(['ACCOUNT', 'SEARCH'])
  type!: 'ACCOUNT' | 'SEARCH';

  @IsNotEmpty()
  @IsString()
  value!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  max_results!: number;
}
