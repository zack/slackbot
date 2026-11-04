import childProcess from 'child_process';
import path from 'path';

// Long enough that a token that's actually been revoked restarts the bot
// once a minute instead of hammering Slack, short enough that a Slack-side
// blip only costs us a minute of downtime.
const RESTART_DELAY_MS = 60 * 1000;

let restartScheduled = false;

// When Slack's socket connection drops, @slack/socket-mode reconnects on its
// own by asking for a new WSS URL. But if that request fails with an error it
// considers unrecoverable (invalid_auth, any network or HTTP error) it gives
// up and throws from inside its own reconnect timer, where nobody can catch
// it. The process stays alive, so pm2 shows the bot as online, but it never
// hears another message.
const isSocketModeFailure = (err: unknown) => (
  err instanceof Error
  && (err.stack ?? '').includes('SocketModeClient')
);

// Exiting isn't enough here: pm2 runs `tsx watch`, which outlives its child
// and just waits for a file to change. So this goes through pm2 the same way
// ?restart does.
const scheduleRestart = () => {
  if (restartScheduled) {
    return;
  }
  restartScheduled = true;

  console.error(
    `Socket Mode gave up reconnecting. Restarting in ${RESTART_DELAY_MS / 1000}s.`,
  );

  setTimeout(() => {
    try {
      childProcess.execFileSync('pm2', ['restart', path.basename(process.cwd())]);
    } catch (error) {
      console.error('Restart after socket failure failed:', error);
      restartScheduled = false;
    }
  }, RESTART_DELAY_MS);
};

const recoverFromSocketFailure = (err: unknown) => {
  if (isSocketModeFailure(err)) {
    scheduleRestart();
  }
};

export default recoverFromSocketFailure;
