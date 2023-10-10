import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { APIError } from 'error';
import { VLLMPromptParameters } from 'types/inference';

export const streamGenericInferenceServer = (
  domain: string,
  payload: { prompt: string } & VLLMPromptParameters,
  handleNewChunk?: (chunk: string) => void | Promise<void>,
  signal?: AbortSignal
) => {
  return new Promise<string>((resolve, reject) => {
    (async () => {
      const response = await fetch(`${domain}/generate`, {
        method: 'POST',
        body: JSON.stringify({ ...payload, stream: true }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain, application/json',
        },
        signal,
      });
      if (response.ok) {
        if (!response.body) return reject('No response body found.');
        const reader = response.body.getReader();
        let responseText: string = '';
        const textDecoder = new TextDecoder();
        let done: boolean = false,
          value: Uint8Array | undefined;
        while (!done) {
          ({ done, value } = await reader.read());
          if (value) {
            let chunk = textDecoder.decode(value);
            responseText += chunk;
            console.log('chunk:', chunk);
            handleNewChunk(chunk);
          }
          if (done) {
            try {
              return resolve(responseText);
            } catch (e) {
              return reject('Could not parse the response');
            }
          }
        }
      } else {
        if (response.headers.get('Content-Type') === 'application/json')
          return reject({ body: await response.json(), status: response.status });
        else return reject(`Request failed.`);
      }
    })();
  });
};

// export const streamPromptWithAxios = (
//   cometAPI: AxiosInstance,
//   payload: PromptPayload,
//   handleNewText?: (token: string) => void | Promise<void>
// ) => {
//   return new Promise<TCometPromptResponse>((resolve, reject) => {
//     (async () => {
//       const { data: stream } = await cometAPI.post(`/prompt`, payload, {
//         responseType: 'stream',
//       });
//       let responsePrefixReceived = false;
//       let responseText: string = '';
//       stream.on('data', (data: BinaryData) => {
//         let chunk = data.toString();

//         if (!responsePrefixReceived && chunk.includes(PROMPT_STREAM_RESPONSE_PREFIX)) {
//           const splitChunks = chunk.split(PROMPT_STREAM_RESPONSE_PREFIX);
//           if (splitChunks.length === 2) {
//             handleNewText?.(splitChunks[0]);
//             responseText = responseText.concat(splitChunks[1] ?? '');
//           } else return reject('Could not parse the response');
//           responsePrefixReceived = true;
//         } else if (responsePrefixReceived) {
//           responseText = responseText.concat(chunk);
//         } else {
//           handleNewText?.(chunk);
//         }
//       });

//       stream.on('end', () => {
//         return resolve(JSON.parse(responseText));
//       });
//     })();
//   });
// };

class ClientError extends Error {}
// class FatalError extends Error {}

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export async function streamOpenAIInferenceServer<T extends 'chat' | 'text'>(
  payload: {
    prompt: T extends 'chat' ? ChatMessage[] : T extends 'text' ? string : never;
    model: string;
  } & VLLMPromptParameters,
  domain: string,
  type: T,
  handleNewChunk?: (chunk: string) => void | Promise<void>,
  signal?: AbortSignal
): Promise<string> {
  try {
    let finalResponse: string;
    await fetchEventSource(`${domain}/v1/${type === 'chat' ? 'chat/completions' : 'completions'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      signal,
      body: JSON.stringify({ ...payload, stream: true }),
      async onopen(response) {
        const contentType = response.headers.get('content-type');
        if (response.ok && contentType.includes(EventStreamContentType)) {
          return; // everything's good
        } else {
          if (contentType === 'application/json') {
            const body = await response.json();
            throw new APIError({ status: response.status, message: body?.message });
          } else {
            throw new APIError({
              status: response.status,
              message: `Request failed with status code: ${response.status}`,
            });
          }
        }
      },
      onmessage(msg) {
        // if the server emits an error message, throw an exception
        // so it gets handled by the onerror callback below:
        // if (msg.event === 'data') {
        // const chunk = JSON.parse(msg.data) as VLLMOpenAICompletionsOutputType;
        finalResponse += msg.data;
        handleNewChunk(msg.data);
        // } else if (msg.event === 'error') {
        // console.error('error while streaming', msg.data);
        // }
      },
      // onclose() {
      //   // if the server closes the connection unexpectedly, retry:
      //   throw new ClientError('Server closed connection.');
      // },
      onerror(err) {
        throw err; // rethrow to stop the operation
      },

      // signal: ctrl.signal,
    });
    return finalResponse;
  } catch (e) {
    // if (e instanceof APIError) {
    //   return { error: e.message };
    // } else {
    console.error('Unknown Error while prompting:', e);
    //   return { error: e?.message || 'Unknown Error' };
    // }
  }
};
