import pong from './commands/ping.js';
import spell from './commands/spell.js';
import spongecase from './commands/spongecase.js';

const RE_FLAG = /-\w/;

const COMMANDS = {
  ping: {
    func: pong,
    help: "Use to check if the bot is running in the current channel/dm. Prints 'pong' if true.",
  },
  spell: {
    func: spell,
    help: 'Spells out the arguments using white emoji text. Flag -y for yellow.',
  },
  spongecase: {
    func: spongecase,
    help: 'Prints out the given text but in sPoNgEcAsE',
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

const dispatch = (context, say) => {
  const command = context.matches[1].split(' ')[0];

  const { flags, text } = getParts(context);

  if (command in COMMANDS) {
    COMMANDS[command].func({
      context, flags, text, say,
    });
  } else if (command === 'help') {
    let out = '';

    for (const cmd in COMMANDS) {
      if (Object.prototype.hasOwnProperty.call(COMMANDS, cmd)) {
        out += `${cmd}: ${cmd.help}\n`;
      }
    }

    say(out);
  }
};

export default dispatch;
