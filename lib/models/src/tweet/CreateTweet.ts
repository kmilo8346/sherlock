import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsISO8601,
} from 'class-validator';
import { PublicMetrics } from './PublicMetrics';

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
  query_id!: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  created_at!: string;
}
