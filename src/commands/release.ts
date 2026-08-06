import { simpleGit } from 'simple-git';

import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond';
import { clearReleaseMarker, writeReleaseMarker } from '../utils/releaseMarker';
import rebuild from './rebuild';
import restart from '../utils/restart';

const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};

const git = simpleGit(options);

// Release the slackbot
const release = async ({ body, say }) => {
  respondThreaded(say, body, 'Releasing. Good luck...');

  git.pull('origin', 'main', { '--rebase': 'true' }, async (err, response) => {
    if (err) {
      console.error('release: git pull failed:', err);
      respondThreaded(
        say,
        body,
        `Something went wrong pulling the latest code. I hope you have ssh access.\n\`\`\`${err.message}\`\`\``,
      );
      return;
    }

    const SHA = childProcess
      .execSync('git rev-parse HEAD')
      .toString().trim();

    const title = childProcess
      .execSync('git show-branch --no-name HEAD')
      .toString().trim();

    if (response.summary.changes === 0) {
      respondThreaded(say, body, `No changes detected. Already on latest commit: ${SHA} (${title})`);
      return;
    }

    respondThreaded(say, body, `Pulled the latest changes, deploying ${SHA} (${title})...`);

    // The restart itself may kill this process before it can report back
    // here, so we leave a marker for the next boot to pick up and confirm.
    writeReleaseMarker({
      channel: body.event.channel,
      threadTs: body.event.channel_type === 'im' ? undefined : (body.event.thread_ts || body.event.ts),
      sha: SHA,
      title,
    });

    const installed = await rebuild({ body, say });

    if (!installed) {
      // No restart is coming from this attempt, so don't leave a marker
      // around to falsely confirm some later, unrelated restart.
      clearReleaseMarker();
      return;
    }

    respondThreaded(say, body, 'Restarting...');

    if (!restart({ body, say })) {
      // No restart is coming from this attempt, so don't leave a marker
      // around to falsely confirm some later, unrelated restart.
      clearReleaseMarker();
    }
  });
};

export default release;
