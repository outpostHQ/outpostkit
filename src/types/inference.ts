export interface IInference {
  prompt: (
    payload: PromptPayload & Record<string, string>,
    handleNewText?: (data: string) => void | Promise<void>,
    options?: PromptOptions
  ) => Promise<any>;
  getInferenceInfo: () => Promise<any>;
}

export interface PromptOptions {
  useNativeFetch?: boolean;
}

export interface PromptPayload {
  prompt: string;
  stream: boolean;
}
