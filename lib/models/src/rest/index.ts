import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  Min,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'sortValue', async: false })
class SortValueConstraint implements ValidatorConstraintInterface {
  validate(value: Record<string, number>) {
    return Object.keys(value).every(
      (key) => value[key] === 1 || value[key] === -1
    );
  }

  defaultMessage() {
    return 'Each sort value must be either 1 (ascending) or -1 (descending)';
  }
}

export class SearchParams {
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

  @IsObject()
  @IsOptional()
  filter?: Record<string, any>;

  @IsObject()
  @IsOptional()
  @Validate(SortValueConstraint, { each: true })
  @Transform(
    ({ value }) => {
      const transformedSort: Record<string, number> = {};
      for (const key in value) {
        transformedSort[key] = parseInt(value[key]);
      }
      return transformedSort;
    },
    { toClassOnly: true }
  )
  sort?: Record<string, number>;
}

export interface ICollection<T> {
  total: number;
  from: number;
  size: number;
  data: T[];
}
