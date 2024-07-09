import RESTClient from './RESTClient';
import { Credentials, IJwtToken } from '@sherlock/models';

class AuthClient extends RESTClient {
  async login(credentials: Credentials): Promise<IJwtToken> {
    const reponse = await this.axios.post('/login', credentials);
    return reponse.data;
  }
}

export const authClient = new AuthClient({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL!}/v1/auth`,
});
