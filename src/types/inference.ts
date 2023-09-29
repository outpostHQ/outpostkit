export interface IInference {
  getInferenceInfo: () => Promise<any>;
}

export interface VLLMOpenAICompletionsPayload {
  prompt: string;
  stream: boolean;
}
export interface VLLMOpenAIChatCompletionsPayload {
  messages: Record<string, string>[];
  stream: boolean;
}

export interface VLLMOpenAICompletionsOutputType {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    text: string;
    logprobs: any;
    finish_reason: any;
  }[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens: number;
  };
}

export interface VLLMOpenAICompletionsOutputType {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    text: string;
    logprobs: any;
    finish_reason: any;
  }[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens: number;
  };
}

export interface VLLMGenericOutputType {
  text: string[];
}

export interface VLLMPromptParameters {
  n?: number;
  best_of?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  use_beam_search?: boolean;
  length_penalty?: number;
  early_stopping?: boolean | string;
  stop?: string | Array<string>;
  stop_token_ids?: Array<string>;
  ignore_eos?: boolean;
  max_tokens?: number;
  logprobs?: number;
  skip_special_tokens?: boolean;
}
