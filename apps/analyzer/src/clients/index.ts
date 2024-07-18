import { OpenAI } from 'openai';
import {
  ICONFIG,
  DataSourceClient,
  TweetClient,
  InsightClient,
} from '@sherlock/core';

const API_CONFIG: ICONFIG = {
  baseURL: process.env.SHERLOCK_BASE_URL,
  apiKey: process.env.SHERLOCK_API_KEY,
};

export const tweetClient = new TweetClient(API_CONFIG);

export const dataSourceClient = new DataSourceClient(API_CONFIG);

export const insightClient = new InsightClient(API_CONFIG);

export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
