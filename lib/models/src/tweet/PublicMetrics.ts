import { IsInt, Min, IsNotEmpty } from 'class-validator';

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
