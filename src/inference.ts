import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';
// import {
//   streamPromptWithAxios,
//   streamPromptWithEventStreaming,
//   streamPromptWithNativeFetch,
// } from 'helpers';
import { IInference, PromptPayload, PromptOptions } from 'types/inference';

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

  async prompt(
    payload: PromptPayload,
    handleNewText?: (data: string) => void | Promise<void>,
    options?: PromptOptions
  ) {
    return { tbd: true };
    //TODO: better error handling
    // if (payload.stream) {
    //   if (typeof window !== 'undefined') {
    //     if (options?.useNativeFetch) {
    //       const resp = await streamPromptWithNativeFetch(
    //         this.cometId,
    //         this.apiKey,
    //         payload,
    //         handleNewText
    //       );
    //       // @ts-ignore
    //       if (resp.error) {
    //         // @ts-ignore
    //         throw new Error(resp.error);
    //       } else {
    //         return resp as TCometPromptResponse;
    //       }
    //     } else {
    //       const resp = await streamPromptWithEventStreaming(
    //         this.inferenceAPI,
    //         this.apiKey,
    //         payload,
    //         handleNewText
    //       );
    //       // @ts-ignore
    //       if (resp.error) {
    //         // @ts-ignore
    //         throw new Error(resp.error);
    //       } else {
    //         return resp as TCometPromptResponse;
    //       }
    //     }
    //   } else {
    //     const resp = await streamPromptWithAxios(this.inferenceAPI, payload, handleNewText);
    //     // @ts-ignore
    //     if (resp.error) {
    //       // @ts-ignore
    //       throw new Error(resp.error);
    //     } else {
    //       return resp as TCometPromptResponse;
    //     }
    //   }
    // } else {
    //   const { data } = await this.cometAPI.post(`/prompt`, payload);
    //   return data as TCometPromptResponse;
    // }
  }

  async delete(): Promise<void> {
    await this.inferenceAPI.delete('/');
  }
}

export default Inference;
