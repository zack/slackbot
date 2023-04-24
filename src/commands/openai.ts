import Database from 'better-sqlite3';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { createWriteStream, unlinkSync } from 'fs';
import https from 'https';
import { Configuration, OpenAIApi } from 'openai';
import { tmpdir } from 'os';
import { format as formatDate, startOfMonth, sub as subtractDate } from 'date-fns';

import { getTextFromBody } from '../utils/getTextFromBody';
import { respond, respondThreaded } from '../utils/respond';

dotenv.config();

const db = new Database('../openai.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage
db.exec(`CREATE TABLE IF NOT EXISTS openai(
                command TEXT,
                tokens INTEGER,
                cost REAL,
                ts INTEGER(4) NOT NULL DEFAULT (strftime('%s','now')))`);

let ENABLED = false;
let OPENAI;
const TMP_DIR = tmpdir();

const TEXT_COST_PER_TOKEN = 0.00002; // $USD using Davinci https://openai.com/pricing/
const CHAT_COST_PER_TOKEN = 0.000002; // $USD using gpt-3.5-turbo https://openai.com/pricing/
const COST_PER_IMAGE = 0.02; // $USD using DALL-E @ 1024x1024
const DALL_E_RESOLUTION = '1024x1024';

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
    size: DALL_E_RESOLUTION,
  });

  return (response.data.data[0].url);
};

const logRequest = (command, tokens) => {
  let cost;

  if (command === 'aiart') {
    cost = COST_PER_IMAGE;
  } else if (command === 'aichat') {
    cost = tokens * CHAT_COST_PER_TOKEN;
  } else {
    cost = tokens * TEXT_COST_PER_TOKEN;
  }

  db.prepare('INSERT INTO openai(command, tokens, cost) values (?, ?, ?)').run(command, tokens, cost);
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

    logRequest('aiart', 0);

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

const aiChat = async ({
  app, body, flags, text, say,
}) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided.');
    return;
  }

  if (text.trim().length === 0) {
    respondThreaded(say, body, 'Usage: `?aichat <prompt>`. Flag length (0-4000) with -l or temp (0-9) with -t. E.g. ?aitext -l300 -t5 <prompt>');
    return;
  }

  let temperature = 0;
  let maxTokens = 2000;

  for (const flag of flags) {
    if (flag[0] === 'l') {
      const parsedFlagVal = parseInt(flag[1], 10) || maxTokens;
      maxTokens = Math.max(Math.min(parsedFlagVal, 4000), 2);
    } else if (flag[0] === 't') {
      temperature = Math.max(Math.min(parseFloat(flag[1]), 2), 0);
    }
  }

  app.client.reactions.add({
    channel: body.event.channel,
    name: 'art-loading',
    timestamp: body.event.ts,
  });

  try {
    const response = await OPENAI.createChatCompletion({
      max_tokens: maxTokens,
      model: 'gpt-3.5-turbo',
      temperature,
      n: 1,
      messages: [{ role: 'user', content: text }],
    });
    respond(say, body, `${response.data.choices[0].message.content}`);
    logRequest('aichat', response.data.usage.total_tokens);
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
  let maxTokens = 2000;

  for (const flag of flags) {
    if (flag[0] === 'l') {
      const parsedFlagVal = parseInt(flag[1], 10) || maxTokens;
      maxTokens = Math.max(Math.min(parsedFlagVal, 4000), 2);
    } else if (flag[0] === 't') {
      temperature = Math.max(Math.min(parseFloat(flag[1]), 2), 0);
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
    logRequest('aitext', response.data.usage.total_tokens);
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

const getCostFromRequestsForCommand = (requests, cmd) => {
  if (requests.length === 0) {
    return '_no data_';
  }

  const func = (memo, { command, cost }) => memo + (command === cmd ? cost : 0);
  return `$${Math.round(requests.reduce(func, 0) * 100) / 100}`;
};

const aiCost = ({ body, say }) => {
  const now = new Date();

  const startOfThisMonth = startOfMonth(now).getTime() / 1000;
  const thisMonthRequests = db.prepare('SELECT command, cost FROM openai WHERE ts > ?').all(startOfThisMonth);
  const thisMonthTextSum = getCostFromRequestsForCommand(thisMonthRequests, 'aitext');
  const thisMonthArtSum = getCostFromRequestsForCommand(thisMonthRequests, 'aiart');
  const thisMonthChatSum = getCostFromRequestsForCommand(thisMonthRequests, 'aichat');
  const thisMonthName = formatDate(now, 'MMMM');

  const lastMonth = subtractDate(now, { months: 1 });

  const startOfLastMonth = startOfMonth(lastMonth).getTime() / 1000;
  const lastMonthRequests = db.prepare('SELECT command, cost FROM openai WHERE ts > ? AND ts < ?').all(startOfLastMonth, startOfThisMonth);
  const lastMonthTextSum = getCostFromRequestsForCommand(lastMonthRequests, 'aitext');
  const lastMonthArtSum = getCostFromRequestsForCommand(lastMonthRequests, 'aiart');
  const lastMonthChatSum = getCostFromRequestsForCommand(lastMonthRequests, 'aichat');
  const lastMonthName = formatDate(lastMonth, 'MMMM');

  const allTimeRequests = db.prepare('SELECT command, cost FROM openai').all();
  const allTimeTextSum = getCostFromRequestsForCommand(allTimeRequests, 'aitext');
  const allTimeArtSum = getCostFromRequestsForCommand(allTimeRequests, 'aiart');
  const allTimeChatSum = getCostFromRequestsForCommand(allTimeRequests, 'aichat');

  const out = `
*${thisMonthName}* \`?aiart\` cost: ${thisMonthArtSum}
*${thisMonthName}* \`?aichat\` cost: ${thisMonthChatSum}
*${thisMonthName}* \`?aitext\` cost: ${thisMonthTextSum}

*${lastMonthName}* \`?aiart\` cost: ${lastMonthArtSum}
*${lastMonthName}* \`?aichat\` cost: ${lastMonthChatSum}
*${lastMonthName}* \`?aitext\` cost: ${lastMonthTextSum}

*All Time* \`?aiart\` cost: ${allTimeArtSum}
*All Time* \`?aichat\` cost: ${allTimeChatSum}
*All Time* \`?aitext\` cost: ${allTimeTextSum}`;

  respond(say, body, out);
};

export {
  aiArtCommand, aiArtEmoji, aiChat, aiCost, aiText,
};
