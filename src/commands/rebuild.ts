import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond';

// Release the slackbot
const rebuild = async ({ body, say }) => {
  respondThreaded(say, body, 'Rebuilding... (please wait)');
  // Give it time to respond before building
  setTimeout(() => {
    respondThreaded(say, body, 'Running `npm install`...');
    const installOut = childProcess.execSync('npm install').toString();
    respondThreaded(say, body, 'Finished installing! Output:');
    respondThreaded(say, body, installOut);

    respondThreaded(say, body, 'Running `npm run build`...');
    const buildOut = childProcess.execSync('npm run build').toString();
    respondThreaded(say, body, 'Finished building! Output:');
    respondThreaded(say, body, buildOut);
  }, 1000);
};

export default rebuild;
