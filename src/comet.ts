import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';
import { type PromptPayload } from './types';

export class Comet {
  apiKey: string;
  cometId: string;
  cometAPI: AxiosInstance;

  constructor(apiKey: string, cometId: string) {
    this.apiKey = apiKey;
    this.cometId = cometId;

    this.cometAPI = axios.create({
      baseURL: `${API_V1_URL}/comets/${cometId}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async prompt(payload: PromptPayload): Promise<object> {
    const { data } = await this.cometAPI.post(`/prompt`, payload);
    return data;
  }
}

export default Comet;
