import { respondThreaded } from '../utils/respond';
import restart from '../utils/restart';

// Restarts the bot without pulling new code, e.g. to clear a stuck
// tsx/esbuild watch state.
const restartCommand = async ({ body, say }) => {
  respondThreaded(say, body, 'Restarting...');
  restart({ body, say });
};

export default restartCommand;
