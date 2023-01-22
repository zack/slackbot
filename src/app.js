import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import slackBolt from '@slack/bolt'; // slack/bolt uses CommonJS exports

import dispatch from './commandDispatcher.js';

if (process.env.NODE_ENV !== 'production') {
  // use a .env file, but not in production!
  dotenv.config();
}

const { App } = slackBolt;

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Messages that start with ? are interpreted as commands
app.message(/^\?(.*)/, async ({ context, say }) => {
  dispatch(context, say);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  // eslint-disable-next-line no-console
  console.log('⚡️ Bolt app is running!');
})();
