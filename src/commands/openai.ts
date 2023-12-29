import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { createWriteStream, unlinkSync } from 'fs';
import https from 'https';
import { Configuration, OpenAIApi } from 'openai';
import { tmpdir } from 'os';
import { format as formatDate, startOfMonth, sub as subtractDate } from 'date-fns';
import { Between, MoreThan } from 'typeorm';
import AiChat from '../entity/AiChat';
import OpenAi from '../entity/OpenAi';

import { getTextFromBody } from '../utils/getTextFromBody';
import { respond, respondThreaded } from '../utils/respond';

dotenv.config();

let ENABLED = false;
let OPENAI;
const TMP_DIR = tmpdir();

const CHAT_COST_PER_INPUT_TOKEN = 0.00001; // $USD using gpt-4-1106-preview (turbo) https://openai.com/pricing/
const CHAT_COST_PER_OUTPUT_TOKEN = 0.00003; // $USD using gpt-4-1106-preview (turbo) https://openai.com/pricing/
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

const logRequest = (command, tokens?) => {
  let cost;


  if (command === 'aiart') {
    cost = COST_PER_IMAGE;
  } else {
    const { prompt_tokens, completion_tokens } = tokens;
    cost = prompt_tokens * CHAT_COST_PER_INPUT_TOKEN + completion_tokens * CHAT_COST_PER_OUTPUT_TOKEN;
  }

  const newOpenAi = new OpenAi();
  newOpenAi.command = command;
  newOpenAi.cost = cost;
  newOpenAi.tokens = -1; // don't want to track these anymore, but don't want to do a db migration
  newOpenAi.save();
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

    logRequest('aiart');

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

const logMessage = (user, content, role) => {
  const newAiChat = new AiChat();
  newAiChat.user = user;
  newAiChat.content = content;
  newAiChat.role = role;
  newAiChat.save();
};

const logOutgoingMessage = (user, content) => {
  logMessage(user, content, 'user');
};

const logIncomingMessage = (user, content) => {
  logMessage(user, content, 'assistant');
};

const aiChat = async ({
  app, body, flags, text, say,
}) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided.');
    return;
  }

  if (text.trim().length === 0) {
    respondThreaded(say, body, 'Usage: `?aichat <prompt>`. Flag length (0-4000) with -l or temp (0-9) with -t. E.g. ?aichat -l300 -t5 <prompt>');
    return;
  }

  const { user } = body.event;
  let temperature = 0;
  let maxTokens = 2000;

  for (const flag of flags) {
    if (flag[0] === 'l') {
      const parsedFlagVal = parseInt(flag[1], 10) || maxTokens;
      maxTokens = Math.max(Math.min(parsedFlagVal, 4000), 2);
    } else if (flag[0] === 't') {
      temperature = Math.max(Math.min(parseFloat(flag[1]), 2), 0);
    } else if (flag[0] === 'r') {
      AiChat.delete({ user });
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
    const fifteenMinutesInMs = 15 * 60000;
    const fifteenMinutesAgo = new Date(Date.now() - fifteenMinutesInMs);
    const priorChats = await AiChat.findBy({ user, createdDate: MoreThan(fifteenMinutesAgo) });
    const priorChatsClean = priorChats.map((chat) => ({ content: chat.content, role: chat.role }));
    const messages = [...priorChatsClean, { role: 'user', content: text }];

    const response = await OPENAI.createChatCompletion({
      max_tokens: maxTokens,
      model: 'gpt-4-1106-preview',
      temperature,
      n: 1,
      messages,
    });
    const responseMessage = response.data.choices[0].message.content;

    respond(say, body, responseMessage);
    logRequest('aichat', response.data.usage);
    logOutgoingMessage(user, text);
    logIncomingMessage(user, responseMessage);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const errorMessage = e.response.data.error.message;
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

  const startOfThisMonth = startOfMonth(now);
  const thisMonthRequests = await OpenAi.findBy({ createdDate: MoreThan(startOfThisMonth) });
  const thisMonthArtSum = getCostFromRequestsForCommand(thisMonthRequests, 'aiart');
  const thisMonthChatSum = getCostFromRequestsForCommand(thisMonthRequests, 'aichat');
  const thisMonthName = formatDate(now, 'MMMM');

  const lastMonth = subtractDate(now, { months: 1 });

  const startOfLastMonth = startOfMonth(lastMonth);
  const lastMonthRequests = await OpenAi.findBy({
    createdDate: Between(startOfLastMonth, startOfThisMonth),
  });
  const lastMonthArtSum = getCostFromRequestsForCommand(lastMonthRequests, 'aiart');
  const lastMonthChatSum = getCostFromRequestsForCommand(lastMonthRequests, 'aichat');
  const lastMonthName = formatDate(lastMonth, 'MMMM');

  const allTimeRequests = await OpenAi.find();
  const allTimeArtSum = getCostFromRequestsForCommand(allTimeRequests, 'aiart');
  const allTimeChatSum = getCostFromRequestsForCommand(allTimeRequests, 'aichat');

  const out = `
*${thisMonthName}* \`?aiart\` cost: ${thisMonthArtSum}
*${thisMonthName}* \`?aichat\` cost: ${thisMonthChatSum}

*${lastMonthName}* \`?aiart\` cost: ${lastMonthArtSum}
*${lastMonthName}* \`?aichat\` cost: ${lastMonthChatSum}

*All Time* \`?aiart\` cost: ${allTimeArtSum}
*All Time* \`?aichat\` cost: ${allTimeChatSum}`;

  respond(say, body, out);
};

export {
  aiArtCommand, aiArtEmoji, aiChat, aiCost,
};
