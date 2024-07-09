import RESTClient from './RESTClient';

class SubscriptionClient extends RESTClient {}

export const subscriptionClient = new SubscriptionClient({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL!}/v1/subscriptions`,
});
