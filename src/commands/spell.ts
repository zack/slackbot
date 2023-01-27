import { respond } from '../utils/respond';

const RE_ALPHA = /[a-zA-Z]/;

// TODO: CHECK IF THE CORRECT EMOJIS ARE INSTALLED!

const spell = (say, body, blank, specials, prefix, text) => {
  let out = '';

  for (const character of text) {
    if (RE_ALPHA.exec(character) !== null) {
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

  spell(say, body, blank, specials, prefix, text);
};

const scrabble = ({
  body, text, say,
}) => {
  const prefix = 'scrabble-';
  const blank = ':scrabble-blank:';
  const specials = {};

  spell(say, body, blank, specials, prefix, text);
};

export { scrabble, bubble };
