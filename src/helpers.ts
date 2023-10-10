import { AxiosInstance } from 'axios';
import { PROMPT_STREAM_RESPONSE_PREFIX } from './constants';
import { API_V1_URL } from './constants';
import { PromptPayload, TCometPromptResponse } from 'types';
import { TCometPromptStreamResponseError } from './types';
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { APIError } from 'error';

export function sanitizeFilename(filename: string): string {
  const splitFilename = filename.split('.');
  const extension = splitFilename.pop();
  const nameWithoutExtension = splitFilename.join('.');

  const sanitized = nameWithoutExtension.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'file';

  return `${sanitized || 'file'}${extension ? '.' + extension : ''}`;
}
export const streamPromptWithNativeFetch = (
  cometId: string,
  apiKey: string,
  payload: PromptPayload,
  handleNewText?: (token: string) => void | Promise<void>,
  signal?: AbortSignal
) => {
  return new Promise<TCometPromptResponse | TCometPromptStreamResponseError>((resolve, reject) => {
    (async () => {
      const response = await fetch(`${API_V1_URL}/comets/${cometId}/prompt`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Accept: 'text/plain, application/json',
        },
        signal,
      });
      if (response.ok) {
        if (!response.body) return reject('No response body found.');
        const reader = response.body.getReader();
        let responsePrefixReceived = false;
        let responseText: string = '';
        const textDecoder = new TextDecoder();
        let done: boolean = false,
          value: Uint8Array | undefined;
        while (!done) {
          ({ done, value } = await reader.read());
          if (value) {
            let chunk = textDecoder.decode(value);
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
          }
          if (done) {
            try {
              return resolve(JSON.parse(responseText));
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

export const streamPromptWithAxios = (
  cometAPI: AxiosInstance,
  payload: PromptPayload,
  handleNewText?: (token: string) => void | Promise<void>,
  signal?: AbortSignal
) => {
  return new Promise<TCometPromptResponse | TCometPromptStreamResponseError>((resolve, reject) => {
    (async () => {
      const { data: stream } = await cometAPI.post(`/prompt`, payload, {
        responseType: 'stream',
        signal,
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
        return resolve(JSON.parse(responseText));
      });
    })();
  });
};

class ClientError extends Error {}
// class FatalError extends Error {}

export const streamPromptWithEventStreaming = async (
  cometId: string,
  apiKey: string,
  payload: PromptPayload,
  handleNewText?: (token: string) => void | Promise<void>,
  signal?: AbortSignal
): Promise<TCometPromptResponse | TCometPromptStreamResponseError> => {
  try {
    let finalResponse: TCometPromptResponse | TCometPromptStreamResponseError;
    await fetchEventSource(`${API_V1_URL}/comets/${cometId}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${apiKey}`,
      },
      signal,
      body: JSON.stringify(payload),
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
        if (msg.event === 'token') {
          handleNewText(msg.data);
        } else if (msg.event === 'response') {
          try {
            finalResponse = JSON.parse(msg.data);
          } catch (e) {
            throw new ClientError('Encountered error while parsing response into JSON.');
          }
        } else if (msg.event === 'error') {
        }
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
    if (e instanceof APIError) {
      return { error: e.message };
    } else {
      console.error('Unknown Error while prompting:', e);
      return { error: e?.message || 'Unknown Error' };
    }
  }
};