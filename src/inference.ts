import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';
// import {
//   streamPromptWithAxios,
//   streamPromptWithEventStreaming,
//   streamPromptWithNativeFetch,
// } from 'helpers';
import { IInference } from 'types/inference';

export class Inference implements IInference {
  readonly apiKey: string;
  readonly fullName: string;
  private readonly inferenceAPI: AxiosInstance;

  constructor(apiKey: string, fullName: string) {
    this.apiKey = apiKey;
    this.fullName = fullName;

    this.inferenceAPI = axios.create({
      baseURL: `${API_V1_URL}/inference/${fullName}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getInfo() {
    const { data } = await this.inferenceAPI.get('/');
    return data;
  }

  async delete(): Promise<void> {
    await this.inferenceAPI.delete('/');
  }
}

export default Inference;
