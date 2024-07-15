import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class Tweet {
  _id!: string;
  in_reply_to_user_id?: string;
  text!: string;
  edit_history_tweet_ids!: string[];
  public_metrics!: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    bookmark_count: number;
    impression_count: number;
  };
  author_id!: string;
  updated_at!: string;
  created_at!: string;
}

export class PublicMetrics {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  retweet_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  reply_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  like_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  quote_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  bookmark_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  impression_count!: number;
}

export class CreateTweet {
  @IsString()
  @IsNotEmpty()
  _id!: string;

  @IsString()
  @IsOptional()
  in_reply_to_user_id?: string;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  edit_history_tweet_ids!: string[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PublicMetrics)
  @IsNotEmpty()
  public_metrics!: PublicMetrics;

  @IsString()
  @IsNotEmpty()
  author_id!: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  created_at!: string;
}
