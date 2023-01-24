import { simpleGit } from 'simple-git';

import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond.js';

const options = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};

const git = simpleGit(options);

// Release the slackbot
const release = async ({ body, say }) => {
  let out;

  git.pull('origin', 'main', { '--rebase': 'true' }, (err) => {
    if (err) {
      out = 'Something went wrong. I hope you have ssh access.';
      respondThreaded(say, body, out);
    } else {
      const revision = childProcess
        .execSync('git rev-parse HEAD')
        .toString().trim();

      out = `Successfully deployed ${revision}`;
      respondThreaded(say, body, out);
    }
  });
};

export default release;
