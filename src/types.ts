// Memory Client
export interface MemoryClient {
  addMemory: (sessionId: string, payload: Memory) => Promise<Memory>;
  getMemory: (sessionId: string) => Promise<Memory>;
  deleteMemory: (sessionId: string) => Promise<void>;
}

export interface MemoryConfig {
  apiKey?: string;
  clientId?: string;
  baseUrl?: string;
}

export interface Memory {
  messages: Array<{
    content: string;
    role: 'Human' | 'AI';
  }>;
  context?: string;
}

// Comet Client
export interface IComet {
  // index: (payload: IndexInput) => Promise<object>
  prompt: (
    payload: PromptPayload,
    handleNewText?: (data: string) => void | Promise<void>
  ) => Promise<TCometPromptResponse>;
  updateConfig: (payload: UpdateConfigPayload) => Promise<void>;
  setGenerationModel: (payload: SetGenerationModelPayload) => Promise<void>;
  listConversations: (payload: ListConversationsPayload) => Promise<object>;
  getConversation: (payload: GetConversationPayload) => Promise<object>;
  getMessage: (payload: GetMessagePayload) => Promise<object>;
  takeConversationFeedback: (payload: ProvideMessageFeedbackPayload) => Promise<void>;
  deleteComet: () => Promise<void>;
}

export interface IndexInput {
  indexId?: string;
  id?: string;
  imageBase64?: string;
  imageUrl?: string;
  text?: string;
  embedding?: number[];
  metadata?: object;
}

export interface IndexPayload {
  index: string;
  id?: string;
  imageBase64?: string;
  imageUrl?: string;
  text?: string;
  embedding?: number[];
  metadata?: object;
}

export interface BulkIndexPayload {
  data: IndexPayload[];
}

export type Operator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte';

export interface Filter {
  field: string;
  operator: Operator;
  value: string | number;
}

export interface Filters {
  and?: Filter[];
  or?: Filter[];
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

export interface UpdateConfigPayload {
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  stream: false;
}

export interface SetGenerationModelPayload {
  name: string;
  type: 'text' | 'chat';
  vendor: 'openai';
}

export interface SearchPayload {
  index: string;
  imageBase64?: string;
  imageUrl?: string;
  text?: string;
  embedding?: number[];
  filters?: Filters;
}

export interface TuningInput {
  indexId?: string;
  idA: string;
  idB: string;
  label: -1 | 0 | 1;
}

export interface TuningPayload {
  index: string;
  idA: string;
  idB: string;
  label: -1 | 0 | 1;
}

export interface CreateResourcePayload {
  indexId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface UploadFileToUrlPayload {
  url: string;
  file: File | Buffer;
  fileType: string;
  fileSize: number;
}

export type UploadFilePayload = File | string;

export interface FilePayload {
  fileName: string;
  fileType: string;
}

export interface CreateFileResouceResponse {
  url: string;
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
  text: string;
  referencePaths?: string[];
  referencesWithSources?: {
    path: string;
    source_id: string;
  }[];
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
