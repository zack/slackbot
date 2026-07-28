import Database from 'better-sqlite3';

import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { createWriteStream, unlinkSync, writeFileSync } from 'fs';
import https from 'https';
import OpenAI from 'openai';
import { tmpdir } from 'os';
import { sub as subtractDate } from 'date-fns';

import { getTextFromBody } from '../utils/getTextFromBody';
import { respond, respondThreaded } from '../utils/respond';

dotenv.config({ quiet: true });

const db = new Database('./db/local.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage

// to keep track of costs
db.exec(`CREATE TABLE IF NOT EXISTS open_ai(
                command TEXT,
                tokens INTEGER,
                cost REAL,
                createdDate DATETIME DEFAULT CURRENT_TIMESTAMP)`);

// for persistent gpt chats
db.exec(`CREATE TABLE IF NOT EXISTS ai_chat(
                user TEXT,
                content TEXT,
                role INTEGER,
                createdDate DATETIME DEFAULT CURRENT_TIMESTAMP)`);

let ENABLED = false;
let OPENAI;
const TMP_DIR = tmpdir();

// chat
const CHAT_MODEL = 'gpt-5.6-luna';
const CHAT_COST_PER_INPUT_TOKEN = 0.000001; // $1.00 / 1M input tokens, gpt-5.6-luna https://openai.com/pricing/
const CHAT_COST_PER_CACHED_INPUT_TOKEN = 0.0000001; // $0.10 / 1M cached input tokens, gpt-5.6-luna
const CHAT_COST_PER_OUTPUT_TOKEN = 0.000006; // $6.00 / 1M output tokens, gpt-5.6-luna

// images
const IMAGE_QUALITY ='low';
const IMAGE_MODEL = 'gpt-image-2';
const IMAGE_RESOLUTION = '1792x1024';
const IMAGE_COST_PER_TEXT_INPUT_TOKEN = 0.000005; // $5.00 / 1M text input tokens, gpt-image-2
const IMAGE_COST_PER_IMAGE_INPUT_TOKEN = 0.000008; // $8.00 / 1M image input tokens, gpt-image-2
const IMAGE_COST_PER_OUTPUT_TOKEN = 0.00003; // $30.00 / 1M output tokens, gpt-image-2

if (process.env.OPENAI_API_KEY !== undefined) {
  try {
    OPENAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    ENABLED = true;
  } catch (e) {
    console.error(e);
  }
}

const getImage = async (text) => OPENAI.images.generate({
  model: IMAGE_MODEL,
  quality: IMAGE_QUALITY,
  prompt: text,
  n: 1,
  size: IMAGE_RESOLUTION,
});

const writeImageToFile = (imageData, filename) => new Promise<void>((resolve, reject) => {
  if (imageData.b64_json) {
    try {
      writeFileSync(filename, Buffer.from(imageData.b64_json, 'base64'));
      resolve();
    } catch (e) {
      reject(e);
    }
    return;
  }

  if (imageData.url) {
    const file = createWriteStream(filename);

    const request = https.get(imageData.url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', reject);
      response.on('error', reject);
    });
    request.on('error', reject);
    return;
  }

  reject(new Error('OpenAI did not return image data'));
});

const getChatCost = (usage) => {
  const { prompt_tokens, completion_tokens, prompt_tokens_details } = usage;
  const cachedTokens = prompt_tokens_details?.cached_tokens ?? 0;
  const uncachedInputTokens = prompt_tokens - cachedTokens;

  return (
    uncachedInputTokens * CHAT_COST_PER_INPUT_TOKEN +
    cachedTokens * CHAT_COST_PER_CACHED_INPUT_TOKEN +
    completion_tokens * CHAT_COST_PER_OUTPUT_TOKEN
  );
};

const getImageCost = (usage) => {
  if (!usage) {
    return 0;
  }

  const { input_tokens_details, output_tokens } = usage;

  return (
    input_tokens_details.text_tokens * IMAGE_COST_PER_TEXT_INPUT_TOKEN +
    input_tokens_details.image_tokens * IMAGE_COST_PER_IMAGE_INPUT_TOKEN +
    output_tokens * IMAGE_COST_PER_OUTPUT_TOKEN
  );
};

const formatCost = (cost) => (cost < 0.01 ? '<$0.00' : `$${cost.toFixed(2)}`);

// SQLite's CURRENT_TIMESTAMP is UTC; we want open_ai.createdDate in US Eastern (DST-aware).
const getEasternDateParts = (date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)!.value;

  return {
    year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute'), second: get('second'),
  };
};

const getEasternTimestamp = (date = new Date()) => {
  const {
    year, month, day, hour, minute, second,
  } = getEasternDateParts(date);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const getStartOfEasternMonth = (date) => {
  const { year, month } = getEasternDateParts(date);

  return `${year}-${month}-01 00:00:00`;
};

const getEasternMonthName = (date) => new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  month: 'long',
}).format(date);

const logRequest = (command, cost) => {
  const placeholder = -1; // don't want to track tokens anymore, but don't want to do a db migration
  db.prepare('INSERT INTO open_ai(command, tokens, cost, createdDate) values (?, ?, ?, ?)').run(command, placeholder, cost, getEasternTimestamp());
};

const aiArt = async (app, body, channel, text, threadTs, timestamp, say) => {
  if (!ENABLED) {
    respondThreaded(
      say,
      body,
      'This command is not enabled. Likely, no valid API key was provided in `.env`.',
    );
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
    const response = await getImage(text);
    const cost = getImageCost(response.usage);

    await writeImageToFile(response.data[0], filename);

    await app.client.files.uploadV2({
      channel_id: channel,
      file: filename,
      filename: 'this is art',
      initial_comment: `_(${formatCost(cost)})_ ${text}`,
      thread_ts: threadTs,
    });

    unlinkSync(`${filename}`);

    logRequest('aiart', cost);

  } catch (e: any) {
    respond(say, body, `Error: ${e.error?.message ?? e.message}`);
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

const aiArtCommand = async ({ app, body, text, say }) => {
  const { event } = body;

  const { channel } = event;
  const timestamp = event.ts;
  const threadTs = event.thread_ts;

  aiArt(app, body, channel, text, threadTs, timestamp, say);
};

const aiArtEmoji = async ({ app, body, say }) => {
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

const logMessage = (user, content, role) => {
  db.prepare('INSERT INTO ai_chat(user, content, role) values (?, ?, ?)').run(user, content, role);
};

const logOutgoingMessage = (user, content) => {
  logMessage(user, content, 'user');
};

const logIncomingMessage = (user, content) => {
  logMessage(user, content, 'assistant');
};

const aiChat = async ({ app, body, flags, text, say }) => {
  if (!ENABLED) {
    respondThreaded(
      say,
      body,
      'This command is not enabled. Likely, no valid API key was provided.',
    );
    return;
  }

  if (text.trim().length === 0) {
    respondThreaded(
      say,
      body,
      'Usage: `?aichat <prompt>`. Flag length (0-8000) with -l. E.g. ?aichat -l300 <prompt>',
    );
    return;
  }

  const { user } = body.event;
  let maxCompletionTokens = 4000;

  for (const flag of flags) {
    if (flag[0] === 'l') {
      const parsedFlagVal = parseInt(flag[1], 10) || maxCompletionTokens;
      maxCompletionTokens = Math.max(Math.min(parsedFlagVal, 8000), 2);
    } else if (flag[0] === 'r') {
      db.prepare('DELETE FROM ai_chat WHERE user = ?').run(user);
      const out = `Chat history for <@${user}> cleared`;
      respond(say, body, out);
      return;
    }
  }

  app.client.reactions.add({
    channel: body.event.channel,
    name: 'art-loading',
    timestamp: body.event.ts,
  });

  try {
    const priorChats = db.prepare("SELECT content, role FROM ai_chat WHERE user = ? AND createdDate >= Datetime('now', '-15 minutes')").all(user);
    const messages = [...priorChats, { role: 'user', content: text }];

    const response = await OPENAI.chat.completions.create({
      max_completion_tokens: maxCompletionTokens,
      model: CHAT_MODEL,
      n: 1,
      messages,
    });
    const responseMessage = response.choices[0].message.content;
    const cost = getChatCost(response.usage);

    if (!responseMessage) {
      respond(
        say,
        body,
        `_(${formatCost(cost)})_ Error: the response was cut off before any text was generated (the model spent its whole token budget on internal reasoning). Try \`?aichat -l8000 <prompt>\`, or ask something simpler.`,
      );
      logRequest('aichat', cost);
      return;
    }

    respond(say, body, `_(${formatCost(cost)})_ ${responseMessage}`);
    logRequest('aichat', cost);
    logOutgoingMessage(user, text);
    logIncomingMessage(user, responseMessage);
  } catch (e: any) {
    console.log({ e });
    const errorMessage = e.error.message;
    let out;
    if (errorMessage.startsWith("This model's maximum context length")) {
      out = `Error: ${errorMessage}. Use \`?aichat -r\` to reset your chat.`;
    } else {
      out = `Error: ${errorMessage}`;
    }
    respond(say, body, out);
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

const aiCost = async ({ body, say }) => {
  const now = new Date();

  const startOfThisMonth = getStartOfEasternMonth(now);
  const thisMonthRequests = db.prepare('SELECT command, cost FROM open_ai WHERE createdDate > ?').all(startOfThisMonth);
  const thisMonthArtSum = getCostFromRequestsForCommand(
    thisMonthRequests,
    'aiart',
  );
  const thisMonthChatSum = getCostFromRequestsForCommand(
    thisMonthRequests,
    'aichat',
  );
  const thisMonthName = getEasternMonthName(now);

  const lastMonth = subtractDate(now, { months: 1 });

  const startOfLastMonth = getStartOfEasternMonth(lastMonth);
  const lastMonthRequests = db.prepare('SELECT command, cost FROM open_ai WHERE createdDate > ? AND createdDate < ?').all(startOfLastMonth, startOfThisMonth);
  const lastMonthArtSum = getCostFromRequestsForCommand(
    lastMonthRequests,
    'aiart',
  );
  const lastMonthChatSum = getCostFromRequestsForCommand(
    lastMonthRequests,
    'aichat',
  );
  const lastMonthName = getEasternMonthName(lastMonth);

  const allTimeRequests = db.prepare('SELECT command, cost FROM open_ai').all();
  const allTimeArtSum = getCostFromRequestsForCommand(allTimeRequests, 'aiart');
  const allTimeChatSum = getCostFromRequestsForCommand(
    allTimeRequests,
    'aichat',
  );

  const out = `
*${thisMonthName}* \`?aiart\` cost: ${thisMonthArtSum}
*${thisMonthName}* \`?aichat\` cost: ${thisMonthChatSum}

*${lastMonthName}* \`?aiart\` cost: ${lastMonthArtSum}
*${lastMonthName}* \`?aichat\` cost: ${lastMonthChatSum}

*All Time* \`?aiart\` cost: ${allTimeArtSum}
*All Time* \`?aichat\` cost: ${allTimeChatSum}`;

  respond(say, body, out);
};

export { aiArtCommand, aiArtEmoji, aiChat, aiCost };
