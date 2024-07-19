import { DataSourceClient, TweetClient } from '@sherlock/core';
import axios from 'axios';

const API_CONFIG = {
  baseURL: process.env.SHERLOCK_BASE_URL,
  apiKey: process.env.SHERLOCK_API_KEY,
};

export const dataSourceClient = new DataSourceClient(API_CONFIG);

export const tweetClient = new TweetClient(API_CONFIG);

export const xClient = axios.create({
  baseURL: 'https://api.twitter.com/2',
  headers: {
    Authorization: `Bearer ${process.env.X_API_KEY}`,
  },
});
