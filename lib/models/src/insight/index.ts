import 'reflect-metadata';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Insight {
  _id!: string;
  data_source_id!: string;
  slug!: string;
  content!: string;
  stats!: {
    tweets: number;
    retweets: number;
  };
  created_at!: string;
  updated_at!: string;
}

export class InsightStats {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  tweets!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  retweets!: number;
}

export class CreateInsight {
  @IsString()
  @IsNotEmpty()
  data_source_id!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InsightStats)
  stats!: InsightStats;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  created_at!: string;
}

export class UpdateInsight {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InsightStats)
  @IsOptional()
  stats!: InsightStats;
}

export class CreateManyInsights {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateInsight)
  data!: CreateInsight[];
}

class CreateOperation {
  @IsNotEmpty()
  @IsString()
  type!: 'CREATE';

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateInsight)
  data!: CreateInsight;
}

class UpdateOperation {
  @IsNotEmpty()
  @IsString()
  type!: 'UPDATE';

  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateInsight)
  data!: UpdateInsight;
}

class DeleteOperation {
  @IsNotEmpty()
  @IsString()
  type!: 'DELETE';

  @IsNotEmpty()
  @IsString()
  id!: string;
}

export class BulkInsights {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'type',
      subTypes: [
        { value: CreateOperation, name: 'CREATE' },
        { value: UpdateOperation, name: 'UPDATE' },
        { value: DeleteOperation, name: 'DELETE' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  operations!: (CreateOperation | UpdateOperation | DeleteOperation)[];
}
