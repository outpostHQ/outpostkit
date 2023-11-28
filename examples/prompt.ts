import { Comet } from '../src';

void (async () => {
  try {
    const input = 'How do you clear a prisma database?';
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error('No API Key Provided.');

    const fullName = process.env.COMET_FULLNAME;
    if (!fullName) throw new Error('No Comet ID Provided.');

    const comet = new Comet(apiKey, fullName);

    const promptResponse = await comet.prompt({
      stream: false,
      input,
      visitorId: 'dummy_user',
      channel: 'sdk-example',
    });
    console.log(promptResponse);
  } catch (e) {
    console.error(e);
  }
})();
