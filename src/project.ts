import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';

export class Team {
  readonly apiKey: string;
  readonly name: string;
  private readonly teamAPI: AxiosInstance;

  constructor(apiKey: string, name: string) {
    this.apiKey = apiKey;
    this.name = name;

    this.teamAPI = axios.create({
      baseURL: `${API_V1_URL}/teams/${name}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getInfo(): Promise<void> {
    const { data } = await this.teamAPI.get('/');
    return data;
  }

  async listComets(): Promise<object[]> {
    const { data } = await this.teamAPI.get('/services/comets');
    return data;
  }

  async listConfluxes(): Promise<object[]> {
    const { data } = await this.teamAPI.get('/services/confluxes');
    return data;
  }
  async listInferences(): Promise<object[]> {
    const { data } = await this.teamAPI.get('/services/inferences');
    return data;
  }
}
