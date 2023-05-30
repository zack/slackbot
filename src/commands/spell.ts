import { respond } from '../utils/respond';

const RE_ALPHA = /[a-zA-Z]/;
const RE_ALPHANUMERIC = /[a-zA-Z0-9]/;

// TODO: CHECK IF THE CORRECT EMOJIS ARE INSTALLED!

const spell = (say, body, blank, specials, prefix, text, numeric) => {
  let out = '';
  const re = numeric ? RE_ALPHANUMERIC : RE_ALPHA;

  for (const character of text) {
    if (re.exec(character) !== null) {
      out += `:${prefix}${character}:`;
    } else if (character === ' ') {
      out += blank;
    } else if (character in specials) {
      out += `:${prefix}${specials[character]}:`;
    } else {
      out += character;
    }
  }

  respond(say, body, out);
};

const meow = ({
  body, text, say,
}) => {
  const prefix = 'meow-';
  const blank = ':spacer:';
  const specials = {
    '?': 'question-mark',
    '!': 'exclamation-mark',
  };

  spell(say, body, blank, specials, prefix, text, true);
};

const bubble = ({
  body, flags, text, say,
}) => {
  const prefix = flags[0]?.includes('y') ? 'alphabet-yellow-' : 'alphabet-white-';
  const blank = ':spacer:';
  const specials = {
    '#': 'hash',
    '?': 'question',
    '!': 'exclamation',
  };

  spell(say, body, blank, specials, prefix, text, false);
};

const scrabble = ({
  body, text, say,
}) => {
  const prefix = 'scrabble-';
  const blank = ':scrabble-blank:';
  const cleanText = text.replace(/&amp;/g, '&');
  const specials = {
    $: 'dollar',
    '!': 'exclamation',
    '"': 'quotes',
    '#': 'hash',
    '%': 'percent',
    '&': 'and',
    '(': 'left-paren',
    ')': 'right-paren',
    '*': 'star',
    '-': 'hyphen',
    '=': 'equals',
    '?': 'question',
    '@': 'at',
    '^': 'carat',
  };

  spell(say, body, blank, specials, prefix, cleanText, false);
};

export { scrabble, bubble, meow };
