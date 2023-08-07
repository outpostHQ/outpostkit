import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';

export class Project {
  readonly apiKey: string;
  readonly projectId: string;
  private readonly projectAPI: AxiosInstance;

  constructor(apiKey: string, projectId: string) {
    this.apiKey = apiKey;
    this.projectId = projectId;

    this.projectAPI = axios.create({
      baseURL: `${API_V1_URL}/projects/${projectId}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getProjectInfo(): Promise<void> {
    const { data } = await this.projectAPI.get('/');
    return data;
  }

  async listProjectComets(): Promise<object[]> {
    const { data } = await this.projectAPI.get('/comets');
    return data;
  }

  async listProjectConfluxes(): Promise<object[]> {
    const { data } = await this.projectAPI.get('/confluxes');
    return data;
  }
}
