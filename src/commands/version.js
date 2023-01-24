import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond.js';

// Respond with the SHA of the git commit at HEAD
const version = ({ body, say }) => {
  const SHA = childProcess
    .execSync('git rev-parse HEAD')
    .toString().trim();

  const title = childProcess
    .execSync('git show-branch --no-name HEAD')
    .toString().trim();

  const out = `Running commit ${SHA} (${title})`;

  respondThreaded(say, body, out);
};

export default version;
