import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';
import type {
  UpdateConfigPayload,
  PromptPayload,
  SetGenerationModelPayload,
  ProvideMessageFeedbackPayload,
  IComet,
  ListSessionsPayload,
  ICometSession,
} from './types';
import { streamPromptWithAxios, streamPromptWithNativeFetch } from 'helpers';

export class Comet implements IComet {
  readonly apiKey: string;
  readonly cometId: string;
  private readonly cometAPI: AxiosInstance;

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

  async getCometInfo() {
    const { data } = await this.cometAPI.get('/');
    return data;
  }

  async prompt(payload: PromptPayload, handleNewText?: (data: string) => void | Promise<void>) {
    //TODO: better error handling
    if (payload.stream) {
      if (typeof window !== 'undefined') {
        return await streamPromptWithNativeFetch(this.cometId, this.apiKey, payload, handleNewText);
      } else return await streamPromptWithAxios(this.cometAPI, payload, handleNewText);
    } else {
      const { data } = await this.cometAPI.post(`/prompt`, payload);
      return data;
    }
  }

  async updateConfig(payload: UpdateConfigPayload): Promise<void> {
    await this.cometAPI.put(`/`, payload);
  }

  async setGenerationModel(payload: SetGenerationModelPayload): Promise<void> {
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
