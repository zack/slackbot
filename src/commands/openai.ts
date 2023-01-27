import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { createWriteStream, unlinkSync } from 'fs';
import https from 'https';
import { Configuration, OpenAIApi } from 'openai';
import { tmpdir } from 'os';

import getTextFromBody from '../utils/getTextFromBody';
import { respond, respondThreaded } from '../utils/respond';

dotenv.config();

let ENABLED = false;
let OPENAI;
const TMP_DIR = tmpdir();

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

const getImage = async (text) => {
  const response = await OPENAI.createImage({
    prompt: text,
    n: 1,
    size: '1024x1024',
  });

  return (response.data.data[0].url);
};

const aiArt = async (app, body, channel, text, threadTs, timestamp, say) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided in `.env`.');
    return;
  }

  if (text.trim().length === 0) {
    return;
  }

  app.client.reactions.add({
    channel,
    name: 'art-loading',
    timestamp,
  });

  try {
    const filename = `/${TMP_DIR}/openai-output-${Date.now()}.png`;
    const imageUrl = await getImage(text);
    const file = createWriteStream(filename);

    https.get(imageUrl, (response) => {
      response.pipe(file);
      file.on('finish', async () => {
        file.close();

        await app.client.files.uploadV2({
          channel_id: channel,
          file: filename,
          filename: 'this is art',
          initial_comment: text,
          thread_ts: threadTs,
        });

        unlinkSync(`${filename}`);
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    respond(say, body, `Error: ${e.response.data.error.message}`);
  } finally {
    app.client.reactions.remove({
      channel,
      name: 'art-loading',
      timestamp,
    });
    app.client.reactions.add({
      channel,
      name: 'white_check_mark',
      timestamp,
    });
  }
};

const aiArtCommand = async ({
  app, body, text, say,
}) => {
  const { event } = body;

  const { channel } = event;
  const timestamp = event.ts;
  const threadTs = event.thread_ts;

  aiArt(app, body, channel, text, threadTs, timestamp, say);
};

const aiArtEmoji = async ({
  app, body, say,
}) => {
  const { event } = body;

  const text = await getTextFromBody(app, body);
  const timestamp = event.item.ts;
  const { channel } = event.item;
  // Using either of the 'ts's on the event causes weird message dupe bugs
  const history = await app.client.conversations.replies({
    channel,
    ts: timestamp,
  });
  const threadTs = history.messages[0].thread_ts || history.messages[0].ts;

  aiArt(app, body, channel, text, threadTs, timestamp, say);
};

const aiText = async ({
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

  app.client.reactions.add({
    channel: body.event.channel,
    name: 'art-loading',
    timestamp: body.event.ts,
  });

  try {
    const response = await OPENAI.createCompletion({
      max_tokens: maxTokens,
      model: 'text-davinci-003',
      temperature,
      n: 1,
      prompt: text,
    });
    respond(say, body, `${response.data.choices[0].text}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    respond(say, body, `Error: ${e.response.data.error.message}`);
  } finally {
    app.client.reactions.remove({
      channel: body.event.channel,
      name: 'art-loading',
      timestamp: body.event.ts,
    });
  }
};

export { aiArtCommand, aiArtEmoji, aiText };
