export const VLLMPromptConfigs = {
  type: 'object',
  properties: {
    n: {
      type: 'integer',
      minimum: 1,
    },
    best_of: {
      type: ['integer', 'null'],
    },
    presence_penalty: {
      type: 'number',
      minimum: -2.0,
      maximum: 2.0,
    },
    frequency_penalty: {
      type: 'number',
      minimum: -2.0,
      maximum: 2.0,
    },
    temperature: {
      type: 'number',
      minimum: 0.0,
    },
    top_p: {
      type: 'number',
      minimum: 0.0,
      maximum: 1.0,
    },
    top_k: {
      type: 'integer',
      minimum: -1,
    },
    use_beam_search: {
      type: 'boolean',
    },
    length_penalty: {
      type: 'number',
      minimum: 0.0,
    },
    early_stopping: {
      type: ['boolean', 'string'],
    },
    stop: {
      type: ['array', 'string', 'null'],
      items: {
        type: 'string',
      },
    },
    stop_token_ids: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    ignore_eos: {
      type: 'boolean',
    },
    max_tokens: {
      type: 'integer',
      minimum: 1,
    },
    logprobs: {
      type: ['integer', 'null'],
      minimum: 0,
    },
    skip_special_tokens: {
      type: 'boolean',
    },
  },
};
