import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import slackBolt from '@slack/bolt';

import { dispatchCommand, dispatchReaction } from './commandDispatcher.js';

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
app.message(/^\?(.*)/, async ({ body, context, say }) => {
  dispatchCommand(app, body, context, say);
});

app.event('reaction_added', async ({
  body, context, say,
}) => {
  const { reaction } = body.event;
  dispatchReaction(app, body, context, reaction, say);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  // eslint-disable-next-line no-console
  console.log('⚡️ Bolt app is running!');
})();
