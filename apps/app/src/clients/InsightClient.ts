import RESTClient from './RESTClient';

class InsightClient extends RESTClient {}

export const insightClient = new InsightClient({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL!}/v1/insights`,
});
