import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL } from './constants';
import {
  type UpdateConfigPayload,
  type PromptPayload,
  type SetGenerationModelPayload,
  type ListConversationsPayload,
  type GetConversationPayload,
  type GetMessagePayload,
  type ProvideMessageFeedbackPayload,
} from './types';

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

  async updateConfig(payload: UpdateConfigPayload): Promise<void> {
    await this.cometAPI.post(`/openai-configs`, payload);
  }

  async setGenerationModel(payload: SetGenerationModelPayload): Promise<void> {
    await this.cometAPI.post(`/model`, payload);
  }

  async listConversations(payload: ListConversationsPayload): Promise<object> {
    const { data } = await this.cometAPI.get(`/conversations`, {
      params: payload,
    });
    return data;
  }

  async getConversation({ conversationId }: GetConversationPayload): Promise<object> {
    const { data } = await this.cometAPI.get(`/conversations/${conversationId}`);
    return data;
  }

  async getMessage({ messageId }: GetMessagePayload): Promise<object> {
    const { data } = await this.cometAPI.get(`/messages/${messageId}`);
    return data;
  }

  async provideMessageFeedback({
    messageId,
    ...feedbackBody
  }: ProvideMessageFeedbackPayload): Promise<void> {
    await this.cometAPI.post(`/messages/${messageId}/feedback`, feedbackBody);
  }
}

export default Comet;
