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
  type IComet,
} from './types';

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

  async getCometInfo(): Promise<object> {
    const { data } = await this.cometAPI.get<object>('/');
    return data;
  }

  async prompt(payload: PromptPayload, handleNewText: (data: string) => void | Promise<void>) {
    if (!payload.stream) {
      const { data } = await this.cometAPI.post(`/prompt`, payload, {
        responseType: 'stream',
      });
      let responsePrefixRecieved = false;
      let response: string;
      data.on('data', (data) => {
        data = data.toString();
        if (data === '----RESPONSE----') responsePrefixRecieved = true;
        else if (responsePrefixRecieved) {
          response = JSON.stringify(data);
        } else {
          handleNewText(data);
        }
      });
      return response;
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

  async listConversations(payload: ListConversationsPayload): Promise<object> {
    const { data } = await this.cometAPI.get<object>(`/conversations`, {
      params: payload,
    });
    return data;
  }

  async getConversation({ conversationId }: GetConversationPayload): Promise<object> {
    const { data } = await this.cometAPI.get<object>(`/conversations/${conversationId}`);
    return data;
  }

  async getMessage({ messageId }: GetMessagePayload): Promise<object> {
    const { data } = await this.cometAPI.get<object>(`/messages/${messageId}`);
    return data;
  }

  async provideMessageFeedback({
    messageId,
    ...feedbackBody
  }: ProvideMessageFeedbackPayload): Promise<void> {
    await this.cometAPI.post(`/messages/${messageId}/feedback`, feedbackBody);
  }

  async deleteComet(): Promise<void> {
    await this.cometAPI.delete('/');
  }
}

export default Comet;
