import { simpleGit } from 'simple-git';

import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond';
import rebuild from './rebuild';

const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};

const git = simpleGit(options);

// Release the slackbot
const release = async ({ body, say }) => {
  respondThreaded(say, body, 'Good luck... (no response => good)');

  let out;

  git.pull('origin', 'main', { '--rebase': 'true' }, (err, response) => {
    if (err) {
      out = 'Something went wrong. I hope you have ssh access.';
      respondThreaded(say, body, out);
    } else {
      // It seems like pm2 restarts the process before this can return if there
      // is in fact a release, which means the user won't get feedback that a
      // release happened.. I don't know what to do about that.

      const SHA = childProcess
        .execSync('git rev-parse HEAD')
        .toString().trim();

      const title = childProcess
        .execSync('git show-branch --no-name HEAD')
        .toString().trim();

      if (response.summary.changes > 0) {
        rebuild({ body, say });
      } else {
        out = `No changes deteced. Already on latest commit: ${SHA} (${title})`;
        respondThreaded(say, body, out);
      }
    }
  });
};

export default release;
