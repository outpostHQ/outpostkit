import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';

export class Conflux {
  readonly apiKey: string;
  readonly confluxId: string;
  private readonly confluxAPI: AxiosInstance;

  constructor(apiKey: string, cometId: string) {
    this.apiKey = apiKey;
    this.confluxId = cometId;

    this.confluxAPI = axios.create({
      baseURL: `${API_V1_URL}/confluxes/${cometId}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getConfluxInfo(): Promise<object> {
    const { data } = await this.confluxAPI.get<object>('/');
    return data;
  }

  async deleteConflux(): Promise<void> {
    await this.confluxAPI.delete('/');
  }

  async updateConflux(payload: { name: string }): Promise<void> {
    await this.confluxAPI.put('/', payload);
  }
}
