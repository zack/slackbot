import { apod, curiousity } from './commands/nasa';
import {
  gimme, learnCommand, learnEmoji, unlearnCommand, unlearnEmoji,
} from './commands/learn';
import { plusCommand, plusEmoji, pluses } from './commands/plus';
import { aiArtCommand, aiArtEmoji, aiText } from './commands/openai';
import emojibomb from './commands/emojibomb';
import gif from './commands/gif';
import github from './commands/github';
import pong from './commands/ping';
import rebuild from './commands/rebuild';
import release from './commands/release';
import { bubble, scrabble } from './commands/spell';
import spongecase from './commands/spongecase';
import summon from './commands/summon';
import version from './commands/version';

import { respondDirectly } from './utils/respond';

const RE_FLAG = /^-[a-zA-Z0-9]+/;

const COMMANDS = {
  '++': {
    func: plusCommand,
    help: 'Give another use 1 plus. Alias of ?plus.',
  },
  aiart: {
    func: aiArtCommand,
    help: 'Queries openai for some art.',
  },
  aitext: {
    func: aiText,
    help: 'Queries openai for some text. Flag temperature (0-9) with -t and length (2-4000) with -l. e.g.: `?aitext -t5 -l200 <prompt>`',
  },
  apod: {
    func: apod,
    help: 'Gets the Astronomy Photo of the Day from NASA Open API. Pass it a date if you want. Defaults to today. e.g. `?apod 2022-05-30`',
  },
  bubble: {
    func: bubble,
    help: 'Spells out the arguments using white emoji text. Flag -y for yellow.',
  },
  curiousity: {
    func: curiousity,
    help: 'Gets a random image from curiousity rover. Pass it a date if you want. Defaults to 2 months ago. e.g. `?curiousity 2022-05-30`',
  },
  deploy: {
    func: release,
    help: 'Fetches and deploys the most recent commit of this slackbot. Alias of ?release.',
  },
  emojime: {
    func: pong,
    help: 'Like ping.',
  },
  emojibomb: {
    func: emojibomb,
    help: 'Try it.',
  },
  gif: {
    func: gif,
    help: 'Summons a random gif from giphy.',
  },
  gimme: {
    func: gimme,
    help: 'Fetches a random message learned about a user.',
  },
  github: {
    func: github,
    help: 'Returns the GitHub URL where you can find and contribute to this project.',
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
  rebuild: {
    func: rebuild,
    help: 'Rebuilds the typescript.',
  },
  release: {
    func: release,
    help: 'Fetches and deploys the most recent commit of this slackbot.',
  },
  scrabble: {
    func: scrabble,
    help: 'Spells out the arguments using scrabble emoji text. Flag -y for yellow.',
  },
  spongecase: {
    func: spongecase,
    help: 'Prints out the given text in sPoNgEcAsE.',
  },
  summon: {
    func: summon,
    help: 'Summon an image from google image search.',
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
  aiart: {
    func: aiArtEmoji,
  },
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
  const flags :string[][] = [];
  let firstNonflagIndex;

  for (const [index, token] of tokens.entries()) {
    if (RE_FLAG.exec(token) !== null) {
      flags.push([token[1], token.slice(2)]);
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
  const command = context.matches[1].split(' ')[0].toLowerCase();

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
      body, say, text: command,
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
