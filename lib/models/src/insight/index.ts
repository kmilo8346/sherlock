import {
  IsInt,
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
  content!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InsightStats)
  stats!: InsightStats;
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
