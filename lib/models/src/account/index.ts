import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class Account {
  _id!: string;
  username!: string;
  name!: string;
  description?: string;
  profile_image_url?: string;
  protected!: boolean;
  public_metrics!: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  verified!: string;
  enabled!: boolean;
  last_sync_date!: string;
  updated_at!: string;
  created_at!: string;
}

export class PublicMetrics {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  followers_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  following_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  tweet_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  listed_count!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  like_count!: number;
}

export class CreateAccount {
  @IsString()
  @IsNotEmpty()
  _id!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  profile_image_url?: string;

  @IsBoolean()
  @IsNotEmpty()
  protected!: boolean;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PublicMetrics)
  @IsNotEmpty()
  public_metrics!: PublicMetrics;

  @IsBoolean()
  @IsNotEmpty()
  verified!: string;

  @IsBoolean()
  @IsNotEmpty()
  enabled!: boolean;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  last_sync_date!: string;

  @IsString()
  @IsNotEmpty()
  @IsISO8601()
  created_at!: string;
}

export class UpdateAccount {
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsString()
  @IsOptional()
  @IsISO8601()
  last_sync_date?: string;
}
