import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { Configuration, OpenAIApi } from 'openai';
import { respond, respondThreaded } from '../utils/respond';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const aiart = async ({
  app, body, text, say,
}) => {
  if (text.trim().length === 0) {
    respondThreaded(say, body, 'Usage: `?aiart <prompt>`');
    return;
  }

  const message = await app.client.chat.postMessage({
    channel: body.event.channel,
    text: 'Working...',
  });

  try {
    const response = await openai.createImage({
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
  if (text.trim().length === 0) {
    respondThreaded(say, body, 'Usage: `?aitext <prompt>`');
    return;
  }

  const temperature = flags.length > 0 && flags[0][0] === 't' && /[0-9]/.exec(flags[0][1]) !== null
    ? flags[0][1]
    : 0;

  const message = await app.client.chat.postMessage({
    channel: body.event.channel,
    temperature,
    text: 'Working...',
  });

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: text,
      n: 1,
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
