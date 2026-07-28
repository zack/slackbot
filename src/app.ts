import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import announceEmojiChange from './emojiChanges';
import scheduleAutoRelease from './autoRelease';
import incrementChannelName from './channelIncrementer';
import { dispatchCommand, dispatchReaction } from './commandDispatcher';
import { consumeReleaseMarker } from './utils/releaseMarker';

dotenv.config({ quiet: true });

const { App } = require('@slack/bolt');

const app = new App({
  appToken: process.env.SOCKET_TOKEN,
  port: process.env.PORT || 3000,
  ignoreSelf: false,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  token: process.env.SLACK_BOT_TOKEN,
  // Socket mode doesn't listen on any HTTP port by default, so without a
  // customRoute here, Bolt never starts the underlying server and there's
  // nothing for an uptime monitor to hit.
  customRoutes: [
    {
      path: '/health',
      method: ['GET'],
      handler: (_req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ok');
      },
    },
  ],
});

// Messages that start with ? are interpreted as commands
app.message(/^\?([^ ].*)/, async ({ body, context, say }) => {
  dispatchCommand(app, body, context, say);
});

const incrementerWords = (process.env.WORDS || '')
  .split(',')
  .filter((w) => w !== '');
if (incrementerWords.length > 0) {
  app.message(new RegExp(`(${incrementerWords.join('|')})`, 'g'), async () => {
    incrementChannelName(
      app,
      process.env.INCREMENTING_CHANNEL_ID,
      process.env.SLACK_USER_TOKEN,
    );
  });
}

app.event('reaction_added', async ({ body, context, say }) => {
  const { reaction } = body.event;
  dispatchReaction(app, body, context, reaction, say);
});

app.event('emoji_changed', async ({ body }) => {
  announceEmojiChange(app, body, process.env.EMOJI_CHANNEL_ID);
});

scheduleAutoRelease(app);

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');

  // If we just came up from a ?release-triggered rebuild, confirm it here
  // instead of from the old process, which pm2 likely killed mid-rebuild.
  const marker = consumeReleaseMarker();
  if (marker) {
    await app.client.chat.postMessage({
      channel: marker.channel,
      thread_ts: marker.threadTs,
      text: `Release complete — now running \`${marker.sha}\` (${marker.title}).`,
    });
  }
})();
