import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Configuration, OpenAIApi } from 'openai';
import { respond, respondThreaded } from '../utils/respond';

dotenv.config();

let ENABLED = false;
let OPENAI;

if (process.env.OPENAI_API_KEY !== undefined) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    OPENAI = new OpenAIApi(configuration);
    ENABLED = true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

const aiart = async ({
  app, body, text, say,
}) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided in `.env`.');
    return;
  }

  if (text.trim().length === 0) {
    respondThreaded(say, body, 'Usage: `?aiart <prompt>`');
    return;
  }

  const message = await app.client.chat.postMessage({
    channel: body.event.channel,
    text: 'Working...',
  });

  try {
    const response = await OPENAI.createImage({
      prompt: text,
      n: 1,
      size: '1024x1024',
    });
    respond(say, body, `<${response.data.data[0].url}|${text}>`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    respond(say, body, `Error: ${e.response.data.error.message}`);
  } finally {
    app.client.chat.delete({
      channel: body.event.channel,
      ts: message.message.ts,
    });
  }
};

const aitext = async ({
  app, body, flags, text, say,
}) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided.');
    return;
  }

  if (text.trim().length === 0) {
    respondThreaded(say, body, 'Usage: `?aitext <prompt>`. Flag length (0-4000) with -l or temp (0-9) with -t. E.g. ?aitext -l300 -t5 <prompt>');
    return;
  }

  let temperature = 0;
  let maxTokens = 32;

  for (const flag of flags) {
    if (flag[0] === 'l') {
      maxTokens = Math.max(Math.min(parseInt(flag[1], 10), 4000), 2);
    } else if (flag[0] === 't') {
      temperature = Math.max(Math.min(parseInt(flag[1], 10), 9), 0);
    }
  }

  const message = await app.client.chat.postMessage({
    channel: body.event.channel,
    temperature,
    text: 'Working...',
  });

  try {
    const response = await OPENAI.createCompletion({
      max_tokens: maxTokens,
      model: 'text-davinci-003',
      n: 1,
      prompt: text,
    });
    respond(say, body, `${response.data.choices[0].text}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    respond(say, body, `Error: ${e.response.data.error.message}`);
  } finally {
    app.client.chat.delete({
      channel: body.event.channel,
      ts: message.message.ts,
    });
  }
};

export { aiart, aitext };
