import axios from 'axios';

export const promptFlashAttentionServerBase64 = async (domain: string, payload: any) => {
  return await axios
    .post(`${domain}/predict/`, payload, {
      responseType: 'arraybuffer',
    })
    .then((response) => Buffer.from(response.data, 'binary').toString('base64'));
};
