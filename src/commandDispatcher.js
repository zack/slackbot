import { learn, unlearn } from './commands/learn.js';
import plus from './commands/plus.js';
import pong from './commands/ping.js';
import spell from './commands/spell.js';
import spongecase from './commands/spongecase.js';

import { respondDirectly } from './utils/respond.js';

const RE_FLAG = /-\w/;

const COMMANDS = {
  learn: {
    func: learn,
    help: 'Record a message or statement to be associated with a user.',
  },
  ping: {
    func: pong,
    help: "Use to check if the bot is running in the current channel/dm. Prints 'pong' if true.",
  },
  plus: {
    func: plus,
    help: 'Give another use 1 plus',
  },
  spell: {
    func: spell,
    help: 'Spells out the arguments using white emoji text. Flag -y for yellow.',
  },
  spongecase: {
    func: spongecase,
    help: 'Prints out the given text in sPoNgEcAsE',
  },
  unlearn: {
    func: unlearn,
    help: 'Delete the record of a message or statement that is associated with a user.',
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

const dispatch = (app, body, context, say) => {
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
  }
};

export default dispatch;
