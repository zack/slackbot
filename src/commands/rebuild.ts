import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond';

// Release the slackbot
const rebuild = async ({ body, say }) => {
  const out = 'Rebuilding';
  respondThreaded(say, body, out);
  // Give it time to respond before building
  setTimeout(() => childProcess.execSync('npm run build'), 1000);
};

export default rebuild;
