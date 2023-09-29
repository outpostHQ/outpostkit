// Comet Client
export interface IComet {
  prompt: (
    payload: PromptPayload,
    handleNewText?: (data: string) => void | Promise<void>,
    options?: PromptOptions
  ) => Promise<TCometPromptResponse>;
  update: (payload: UpdateCometPayload) => Promise<void>;
  updateModel: (payload: UpdateModelPayload) => Promise<void>;
  getMessage: (payload: GetMessagePayload) => Promise<ICometMessage>;
  takeConversationFeedback: (payload: ProvideMessageFeedbackPayload) => Promise<void>;
  deleteComet: () => Promise<void>;
  getCometInfo: () => Promise<ICometInfo>;
  listSessions: (payload: ListSessionsPayload) => Promise<ICometSession[]>;
  getSession: (payload: GetSessionPayload) => Promise<ICometSession>;
  listConversations: <M extends boolean, S extends boolean>(
    payload: ListConversationsPayload
  ) => Promise<
    Array<
      ICometConversation & {
        messages: M extends true ? ICometMessage[] : never;
        stats: S extends true ? ICometConversationStats | null : never;
      }
    >
  >;
  getConversation: (
    payload: GetConversationPayload
  ) => Promise<
    ICometConversation & { messages: ICometMessage[]; stats: ICometConversationStats | null }
  >;
}

export interface PromptOptions {
  useNativeFetch?: boolean;
}

export interface PromptPayload {
  input: string;
  prompt_variables?: Record<string, string>;
  channel?: string;
  visitorId?: string;
  sessionId?: string;
  stream: boolean;
  configs?: {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    presence_penalty?: number;
    frequency_penalty?: number;
  };
}

export interface ListConversationsPayload {
  sessionId: string;
  messages?: boolean;
  stats?: boolean;
}

export interface ListSessionsPayload {
  userId?: string;
  channel?: string;
  visitorId?: string;
}
export interface GetSessionPayload {
  sessionId: string;
}
export interface GetConversationPayload {
  conversationId: string;
}
export interface GetMessagePayload {
  messageId: string;
}

export interface ProvideMessageFeedbackPayload {
  conversationId: string;
  vote?: boolean;
  feedback?: string;
  meta?: object;
}

export interface UpdateCometPayload {
  sectionsMatchThreshold?: number;
  sectionMatchCount?: number;
  name?: string;
}
export type TCometModelType = 'selfhosted' | 'thirdparty';

export interface UpdateModelPayload {
  type?: TCometModelType;
  details?: { name: string; vendor: 'openai' };
  configs?: object;
}

export type CometAIModelType = 'text' | 'chat';

export interface ICometInfo {
  projectId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  thirdPartyKeyId: string | null;
  confluxId: string | null;
  name: string;
  configs: Record<string, any> | null;
  whitelistedDomains: string[];
  promptVariables: Record<string, string>;
  promptTemplate: string | null;
  promptTokenLimit: number | null;
  sectionsMatchThreshold: number | null;
  sectionMatchCount: number | null;
  contextTokenCutoff: number | null;
  model: string;
  modelVendor: string;
  modelType: CometAIModelType;
  conversationHistoryCutoff?: string;
}

export interface ICometSession {
  id: string;
  channel: string;
  metadata: Record<string, any>;
  userId: string;
  visitorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICometConversationStats {
  id: string;
  feedback: string | null;
  noResponse: boolean;
  upvoted: boolean;
  updatedAt: string;
  downvoted: boolean;
  processed: boolean;
}

export interface ICometConversation {
  id: string;
  metadata: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export type CometMessageAuthor = 'agent' | 'human' | 'system' | 'function';

export interface ICometMessage {
  id: string;
  text: string;
  from: CometMessageAuthor;
  meta: Record<string, any> | null;
  conversationId: string;
  createdAt: string;
}

export type TCometPromptResponse = {
  generations: string[];
  meta: {
    referencePaths?: string[];
    referencesWithSources?: {
      path: string;
      source_id: string;
    }[];
  };
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
  conversationId?: string;
  sessionId?: string;
};

export type TCometPromptStreamResponseError = {
  error: string;
};
