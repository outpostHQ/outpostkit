import { Comet } from '../src';

void (async () => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error('No API Key Provided.');

    const cometId = process.env.COMET_ID;
    if (!cometId) throw new Error('No Comet ID Provided.');

    const comet = new Comet(apiKey, cometId);

    const promptResponse = await comet.prompt({
      input: 'What is useCallback',
      stream: false,
      visitorId: 'dummy_user',
      channel: 'sdk-example',
    });
    console.log(promptResponse);
  } catch (e) {
    console.error(e);
  }
})();
