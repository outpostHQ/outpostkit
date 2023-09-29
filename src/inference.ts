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
  readonly inferenceId: string;
  private readonly inferenceAPI: AxiosInstance;

  constructor(apiKey: string, inferenceId: string) {
    this.apiKey = apiKey;
    this.inferenceId = inferenceId;

    this.inferenceAPI = axios.create({
      baseURL: `${API_V1_URL}/inference/${inferenceId}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getInferenceInfo() {
    const { data } = await this.inferenceAPI.get('/');
    return data;
  }

  async delete(): Promise<void> {
    await this.inferenceAPI.delete('/');
  }
}

export default Inference;
