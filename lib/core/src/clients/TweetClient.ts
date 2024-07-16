import { CreateTweet, Tweet, UpdateTweet } from '@sherlock/models';
import { ICONFIG, RESTClient } from './RESTClient';

export class TweetClient extends RESTClient<Tweet, CreateTweet, UpdateTweet> {
  constructor(config: ICONFIG) {
    super(config, 'tweets');
  }
}
