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

// Rebuilds the slackbot. Resolves to whether the build completed
// successfully.
const rebuild = ({ body, say }): Promise<boolean> => {
  respondThreaded(say, body, 'Rebuilding... (please wait)');

  return new Promise((resolve) => {
    // Give it time to respond before building
    setTimeout(() => {
      if (!runStep(say, body, 'installing', 'npm install')) {
        resolve(false);
        return;
      }

      resolve(runStep(say, body, 'building', 'npm run build'));
    }, 1000);
  });
};

export default rebuild;
