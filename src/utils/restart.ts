import childProcess from 'child_process';
import path from 'path';

import { respondThreaded } from './respond';

// Forces a full pm2-level restart rather than trusting tsx watch to notice
// a file change on its own. tsx's own watch-triggered restart reuses its
// long-lived esbuild transpile service, which we've seen serve a stale
// compile of a file that was just changed on disk — killing the whole pm2
// process tree (esbuild service included) is the only way we've found to
// guarantee a truly fresh read. Returns whether the restart was issued.
const restart = ({ body, say }): boolean => {
  try {
    childProcess.execFileSync('pm2', ['restart', path.basename(process.cwd())]);
    return true;
  } catch (error: any) {
    respondThreaded(say, body, `Restart failed.\n\`\`\`${error.message}\`\`\``);
    return false;
  }
};

export default restart;
