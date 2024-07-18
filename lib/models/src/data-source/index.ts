import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  registerDecorator,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SearchParams } from '../rest';

export class DataSource {
  _id!: string;
  label!: string;
  enabled!: boolean;
  account_ids!: string[];
  time_window!: { start_hour: string; end_hour: string };
  created_at!: string;
  updated_at!: string;
}

@ValidatorConstraint({ async: false })
class IsUTCHourConstraint implements ValidatorConstraintInterface {
  validate(hour: string) {
    const hourPattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return typeof hour === 'string' && hourPattern.test(hour);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid UTC hour. Valid format is HH:mm`;
  }
}

function IsUTCHour(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUTCHourConstraint,
    });
  };
}

export class TimeWindow {
  @IsString()
  @IsNotEmpty()
  @IsUTCHour()
  start_hour!: string;

  @IsString()
  @IsNotEmpty()
  @IsUTCHour()
  end_hour!: string;
}

export class CreateDataSource {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsBoolean()
  enabled: boolean = true;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  account_ids!: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => TimeWindow)
  time_window!: TimeWindow;
}

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
  @IsString({ each: true })
  account_ids?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TimeWindow)
  time_window?: TimeWindow;
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
