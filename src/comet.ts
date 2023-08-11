import axios, { type AxiosInstance } from 'axios';
import { API_V1_URL, PROMPT_STREAM_RESPONSE_PREFIX } from './constants';
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

  async prompt(payload: PromptPayload, handleNewText?: (data: string) => void | Promise<void>) {
    if (payload.stream) {
      return new Promise((resolve, reject) => {
        (async () => {
          const { data: stream } = await this.cometAPI.post(`/prompt`, payload, {
            responseType: 'stream',
          });
          let responsePrefixReceived = false;
          let responseText: string = '';
          stream.on('data', (data: BinaryData) => {
            let chunk = data.toString();

            if (!responsePrefixReceived && chunk.includes(PROMPT_STREAM_RESPONSE_PREFIX)) {
              const splitChunks = chunk.split(PROMPT_STREAM_RESPONSE_PREFIX);
              if (splitChunks.length === 2) {
                handleNewText?.(splitChunks[0]);
                responseText = responseText.concat(splitChunks[1] ?? '');
              } else return reject('Could not parse the response');
              responsePrefixReceived = true;
            } else if (responsePrefixReceived) {
              responseText = responseText.concat(chunk);
            } else {
              handleNewText?.(chunk);
            }
          });

          stream.on('end', () => {
            return resolve(responseText);
          });
        })();
      });
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
