export const VLLMPromptSamplingParameters = {
  type: 'object',
  properties: {
    n: {
      type: 'integer',
      minimum: 1,
      default: 1,
    },
    best_of: {
      type: ['integer', 'null'],
      default: null,
    },
    presence_penalty: {
      type: 'number',
      minimum: -2.0,
      maximum: 2.0,
      default: 0,
    },
    frequency_penalty: {
      type: 'number',
      minimum: -2.0,
      maximum: 2.0,
      default: 0,
    },
    temperature: {
      type: 'number',
      minimum: 0.0,
      default: 1,
    },
    top_p: {
      type: 'number',
      minimum: 0.0,
      maximum: 1.0,
      default: 1,
    },
    top_k: {
      type: 'integer',
      minimum: -1,
      default: -1,
    },
    use_beam_search: {
      type: 'boolean',
      default: false,
    },
    length_penalty: {
      type: 'number',
      minimum: 0.0,
      default: 1,
    },
    early_stopping: {
      type: ['boolean', 'string'],
      default: false,
    },
    stop: {
      type: ['array', 'string', 'null'],
      items: {
        type: 'string',
      },
      default: null,
    },
    stop_token_ids: {
      type: 'array',
      items: {
        type: 'integer',
      },
      default: null,
    },
    ignore_eos: {
      type: 'boolean',
      default: false,
    },
    max_tokens: {
      type: 'integer',
      minimum: 1,
      default: 16,
    },
    logprobs: {
      type: ['integer', 'null'],
      minimum: 0,
      default: null,
    },
    skip_special_tokens: {
      type: 'boolean',
      default: true,
    },
  },
};
