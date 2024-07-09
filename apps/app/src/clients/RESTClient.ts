import axios, { AxiosInstance, AxiosHeaders } from 'axios';
import { authenticator } from '../lib';

interface ICONFIG {
  baseURL: string;
}

export default class RESTClient {
  protected axios: AxiosInstance;
  protected baseUrl: string;

  constructor(config: ICONFIG) {
    const { baseURL } = config;
    this.baseUrl = baseURL;
    this.axios = axios.create({ baseURL });

    this.axios.interceptors.request.use(
      async (config) => {
        if (!config) {
          return config;
        }
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        const auth = await authenticator.getAuthFromStorage();
        if (auth === null) {
          return config;
        }

        config.headers['Authorization'] = `${auth.token_type.toLowerCase()} ${
          auth.access_token
        }`;

        return config;
      },
      (error) => {
        throw error;
      }
    );

    // Add a 401 response interceptor
    this.axios.interceptors.response.use(
      (response) => response,
      function (error) {
        if (!error.response) {
          throw error;
        }

        switch (error.response.status) {
          case 401:
            authenticator.signOut();
            throw error;
          case 403:
            throw error;
          default:
            throw error;
        }
      }
    );
  }
}
