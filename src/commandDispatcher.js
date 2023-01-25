import {
  gimme, learnCommand, learnEmoji, unlearnCommand, unlearnEmoji,
} from './commands/learn.js';
import { plusCommand, plusEmoji, pluses } from './commands/plus.js';
import pong from './commands/ping.js';
import release from './commands/release.js';
import spell from './commands/spell.js';
import spongecase from './commands/spongecase.js';
import version from './commands/version.js';

import { respondDirectly } from './utils/respond.js';

const RE_FLAG = /-\w/;

const COMMANDS = {
  '++': {
    func: plusCommand,
    help: 'Give another use 1 plus. Alias of ?plus.',
  },
  deploy: {
    func: release,
    help: 'Fetches and deploys the most recent commit of this slackbot. Alias of ?release.',
  },
  gimme: {
    func: gimme,
    help: 'Fetches a random message learned about a user.',
  },
  learn: {
    func: learnCommand,
    help: 'Records a message or statement to be associated with a user.',
  },
  ping: {
    func: pong,
    help: "Checks if the bot is running in the current channel/dm. Responds with an emoji if it's running.",
  },
  plus: {
    func: plusCommand,
    help: 'Gives another use 1 plus.',
  },
  pluses: {
    func: pluses,
    help: "Checks a user's plus count",
  },
  release: {
    func: release,
    help: 'Fetches and deploys the most recent commit of this slackbot.',
  },
  spell: {
    func: spell,
    help: 'Spells out the arguments using white emoji text. Flag -y for yellow.',
  },
  spongecase: {
    func: spongecase,
    help: 'Prints out the given text in sPoNgEcAsE.',
  },
  unlearn: {
    func: unlearnCommand,
    help: 'Deletes the record of a message or statement that is associated with a user.',
  },
  version: {
    func: version,
    help: 'Responds with the SHA of the current commit at HEAD',
  },
};

const REACTIONS = {
  learn: {
    func: learnEmoji,
  },
  heavy_plus_sign: {
    func: plusEmoji,
  },
  unlearn: {
    func: unlearnEmoji,
  },
};

const getParts = (context) => {
  const tokens = context.matches[1].split(' ').slice(1);
  const flags = [];
  let firstNonflagIndex;

  for (const [index, token] of tokens.entries()) {
    if (RE_FLAG.exec(token) !== null) {
      flags.push(token[1]);
    } else {
      // all flags must be at the beginning
      firstNonflagIndex = index;
      break;
    }
  }

  const text = tokens.slice(firstNonflagIndex).join(' ');

  return ({ flags, text });
};

const dispatchCommand = (app, body, context, say) => {
  const command = context.matches[1].split(' ')[0];

  const { flags, text } = getParts(context);

  if (command in COMMANDS) {
    COMMANDS[command].func({
      app, body, context, flags, text, say,
    });
  } else if (command === 'help') {
    let out = '';

    // Print out all commands and their help text
    // TODO: DM this to the user
    for (const cmd in COMMANDS) {
      if (Object.prototype.hasOwnProperty.call(COMMANDS, cmd)) {
        out += `\`${cmd}\`: ${COMMANDS[cmd].help}\n`;
      }
    }

    respondDirectly(app, body, out);
  } else {
    COMMANDS.gimme.func({
      body, context, say, text: command,
    });
  }
};

const dispatchReaction = (app, body, context, reaction, say) => {
  if (reaction in REACTIONS) {
    REACTIONS[reaction].func({
      app, body, context, say,
    });
  }
};

export { dispatchCommand, dispatchReaction };
