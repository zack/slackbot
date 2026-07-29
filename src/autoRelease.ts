import cron from 'node-cron';

// Every morning, posts "?release" into the configured channel so the bot
// picks up any commits (e.g. auto-merged dependabot PRs) merged to main
// since the last release, exactly as if a human had typed the command.
const scheduleAutoRelease = (app) => {
  const channel = process.env.AUTO_RELEASE_CHANNEL_ID;

  if (!channel) {
    return;
  }

  const schedule = process.env.AUTO_RELEASE_CRON || '0 8 * * *';
  const timezone = process.env.AUTO_RELEASE_TZ || 'America/New_York';

  cron.schedule(schedule, () => {
    app.client.chat.postMessage({ channel, text: '?release' }).catch((err) => {
      console.error('autoRelease: failed to post ?release', err);
    });
  }, { timezone });
};

export default scheduleAutoRelease;
