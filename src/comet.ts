import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';
import type {
  UpdateCometPayload,
  PromptPayload,
  UpdateModelPayload,
  ProvideMessageFeedbackPayload,
  IComet,
  ListSessionsPayload,
  TCometPromptResponse,
  ICometSession,
  PromptOptions,
} from './types/comet';
import {
  streamPromptWithAxios,
  streamPromptWithEventStreaming,
  streamPromptWithNativeFetch,
} from 'helpers';

export class Comet implements IComet {
  readonly apiKey: string;
  readonly fullName: string;
  private readonly cometAPI: AxiosInstance;

  constructor(apiKey: string, fullName: string) {
    this.apiKey = apiKey;
    this.fullName = fullName;

    this.cometAPI = axios.create({
      baseURL: `${API_V1_URL}/comets/${fullName}`,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getInfo() {
    const { data } = await this.cometAPI.get('/');
    return data;
  }

  async prompt(
    payload: PromptPayload,
    handleNewText?: (data: string) => void | Promise<void>,
    options?: PromptOptions
  ) {
    //TODO: better error handling
    if (payload.stream) {
      if (typeof window !== 'undefined') {
        if (options?.useNativeFetch) {
          const resp = await streamPromptWithNativeFetch(
            this.fullName,
            this.apiKey,
            payload,
            handleNewText,
            options?.signal
          );

          // @ts-ignore
          if (resp.error) {
            // @ts-ignore
            throw new Error(resp.error);
          } else {
            return resp as TCometPromptResponse;
          }
        } else {
          const resp = await streamPromptWithEventStreaming(
            this.fullName,
            this.apiKey,
            payload,
            handleNewText,
            options?.signal
          );
          // @ts-ignore
          if (resp.error) {
            // @ts-ignore
            throw new Error(resp.error);
          } else {
            return resp as TCometPromptResponse;
          }
        }
      } else {
        const resp = await streamPromptWithAxios(
          this.cometAPI,
          payload,
          handleNewText,
          options?.signal
        );
        // @ts-ignore
        if (resp.error) {
          // @ts-ignore
          throw new Error(resp.error);
        } else {
          return resp as TCometPromptResponse;
        }
      }
    } else {
      const { data } = await this.cometAPI.post(`/prompt`, payload, { signal: options?.signal });
      return data as TCometPromptResponse;
    }
  }

  async update(payload: UpdateCometPayload): Promise<void> {
    await this.cometAPI.put(`/`, payload);
  }

  async updateModel(payload: UpdateModelPayload): Promise<void> {
    await this.cometAPI.post(`/model`, payload);
  }

  async listSessions(payload: ListSessionsPayload = {}) {
    const { data } = await this.cometAPI.get(`/sessions`, {
      params: payload,
    });
    return data;
  }

  async getSession({ sessionId }) {
    const { data } = await this.cometAPI.get<ICometSession>(`/sessions/${sessionId}`);
    return data;
  }

  async listConversations({ sessionId, stats, messages }) {
    const { data } = await this.cometAPI.get(`/sessions/${sessionId}/conversations`, {
      params: {
        s: stats,
        m: messages,
      },
    });
    return data;
  }

  async getConversation({ conversationId }) {
    const { data } = await this.cometAPI.get(`/conversations/${conversationId}`);
    return data;
  }

  async getMessage({ messageId }) {
    const { data } = await this.cometAPI.get(`/messages/${messageId}`);
    return data;
  }

  async takeConversationFeedback({
    conversationId,
    ...feedbackBody
  }: ProvideMessageFeedbackPayload): Promise<void> {
    await this.cometAPI.post(`/conversations/${conversationId}/feedback`, feedbackBody);
  }

  async deleteComet(): Promise<void> {
    await this.cometAPI.delete('/');
  }
}

export default Comet;
