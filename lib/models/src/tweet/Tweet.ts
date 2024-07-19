import { PublicMetrics } from './PublicMetrics';

export class Tweet {
  _id!: string;
  in_reply_to_user_id?: string;
  text!: string;
  edit_history_tweet_ids!: string[];
  public_metrics!: PublicMetrics;
  author_id!: string;
  query_id!: string;
  updated_at!: string;
  created_at!: string;
}
