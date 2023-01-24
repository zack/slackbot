import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond.js';

// Respond with the SHA of the git commit at HEAD
const version = ({ body, say }) => {
  const revision = childProcess
    .execSync('git rev-parse HEAD')
    .toString().trim();

  respondThreaded(say, body, revision);
};

export default version;
