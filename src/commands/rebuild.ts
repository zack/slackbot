import childProcess from 'child_process';

import { respondThreaded } from '../utils/respond';

// Runs a build step, reporting its output (or failure) to Slack instead of
// letting a non-zero exit crash the whole bot process. Returns whether it
// succeeded.
const runStep = (say, body, label: string, command: string) => {
  respondThreaded(say, body, `Running \`${command}\`...`);

  try {
    const output = childProcess.execSync(command).toString();
    respondThreaded(say, body, `Finished ${label}! Output:`);
    if (output.trim()) {
      respondThreaded(say, body, output);
    }
    return true;
  } catch (error: any) {
    const details = [error.stdout?.toString(), error.stderr?.toString(), error.message]
      .filter(Boolean)
      .join('\n')
      .slice(-1500);
    respondThreaded(
      say,
      body,
      `:x: \`${command}\` failed. The bot is still running the previous build.\n\`\`\`${details}\`\`\``,
    );
    return false;
  }
};

// Installs dependencies for the slackbot. Resolves to whether it completed
// successfully. There's no compile step: pm2 runs the bot straight from
// src via `tsx watch`, which recompiles and reloads on its own whenever a
// .ts file changes.
const rebuild = ({ body, say }): Promise<boolean> => {
  respondThreaded(say, body, 'Installing dependencies... (please wait)');

  return new Promise((resolve) => {
    // Give it time to respond before installing
    setTimeout(() => {
      resolve(runStep(say, body, 'installing', 'npm install'));
    }, 1000);
  });
};

export default rebuild;
