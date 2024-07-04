import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Insight {
  _id!: string;
  topic_id!: string;
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
  topic_id!: string;

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
}
