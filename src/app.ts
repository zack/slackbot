import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import { dispatchCommand, dispatchReaction } from './commandDispatcher';
import announceEmojiChange from './emojiChanges';
import incrementChannelName from './channelIncrementer';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  appToken: process.env.SOCKET_TOKEN,
  ignoreSelf: false,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
});

// Messages that start with ? are interpreted as commands
app.message(/^\?([^ ].*)/, async ({ body, context, say }) => {
  dispatchCommand(app, body, context, say);
});

const incrementerWords = (process.env.WORDS || '').split(',');
app.message(new RegExp(`(${incrementerWords.join('|')})`, 'g'), async () => {
  incrementChannelName(app, process.env.INCREMENTING_CHANNEL_ID, process.env.SLACK_USER_TOKEN);
});

app.event('reaction_added', async ({ body, context, say }) => {
  const { reaction } = body.event;
  dispatchReaction(app, body, context, reaction, say);
});

app.event('emoji_changed', async ({ body }) => {
  announceEmojiChange(app, body, process.env.EMOJI_CHANNEL_ID);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  // eslint-disable-next-line no-console
  console.log('⚡️ Bolt app is running!');
})();
