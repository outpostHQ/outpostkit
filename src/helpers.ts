import { AxiosInstance } from 'axios';
import { PROMPT_STREAM_RESPONSE_PREFIX } from './constants';
import { API_V1_URL } from './constants';
import { PromptPayload } from 'types';

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
  handleNewText?: (token: string) => void | Promise<void>
) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const response = await fetch(`${API_V1_URL}/comets/${cometId}/prompt`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          Accept: 'text/plain, application/json',
        },
      });
      if (response.ok) {
        const reader = response.body.getReader();
        let responsePrefixReceived = false;
        let responseText: string = '';
        const textDecoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (value) {
              // Do something with last chunk of data then exit reader
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
              try {
                return resolve(JSON.parse(responseText));
              } catch (e) {
                return reject('Could not parse the response');
              }
            }
          } else {
            // Otherwise do something here to process current chunk
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
        }
      } else {
        return reject(`Request failed.`);
      }
    })();
  });
};

export const streamPromptWithAxios = (
  cometAPI: AxiosInstance,
  payload: PromptPayload,
  handleNewText?: (token: string) => void | Promise<void>
) => {
  return new Promise((resolve, reject) => {
    (async () => {
      const { data: stream } = await cometAPI.post(`/prompt`, payload, {
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
};
