import { Type } from 'class-transformer';
import { IsArray, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { CreateTweet } from './CreateTweet';

export class CreateManyTweets {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTweet)
  data!: CreateTweet[];
}
