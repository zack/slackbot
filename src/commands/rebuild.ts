import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond';

// Release the slackbot
const rebuild = async ({ body, say }) => {
  respondThreaded(say, body, 'Rebuilding... (please wait)');
  // Give it time to respond before building
  setTimeout(() => {
    const out = childProcess.execSync('npm run build').toString();
    respondThreaded(say, body, 'Finished! Output:');
    respondThreaded(say, body, out);
  }, 1000);
};

export default rebuild;
