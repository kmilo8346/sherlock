import { ICollection, SearchParams } from '@sherlock/models';
import axios, { AxiosInstance } from 'axios';

export interface ICONFIG {
  baseURL: string;
  apiKey: string;
}

export class RESTClient<E, C, U> {
  protected axios: AxiosInstance;
  protected baseUrl: string;
  protected collection: string;

  constructor(config: ICONFIG, collection: string) {
    const { baseURL, apiKey } = config;
    this.baseUrl = baseURL;
    this.axios = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    this.collection = collection;
  }

  async getById(id: string): Promise<E> {
    const response = await this.axios.get<E>(`/${this.collection}/${id}`);
    return response.data;
  }

  async getAll(params: SearchParams): Promise<ICollection<E>> {
    const response = await this.axios.get<ICollection<E>>(
      `/${this.collection}`,
      {
        params,
      }
    );
    return response.data;
  }

  async create(data: C): Promise<E> {
    const response = await this.axios.post<E>(`/${this.collection}`, data);
    return response.data;
  }

  async createMany(data: C[]) {
    await this.axios.post<C[]>(`${this.collection}/many`, { data });
  }

  async update(id: string, data: U) {
    await this.axios.put<U>(`/${this.collection}/${id}`, data);
  }

  async updateMany(data: U[]) {
    await this.axios.put<U[]>(`/${this.collection}/many`, { data });
  }
}
