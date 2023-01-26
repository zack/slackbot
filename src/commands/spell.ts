import { respond } from '../utils/respond';

const RE_ALPHA = /[a-zA-Z]/;

const SPECIAL_CHARACTERS = {
  '#': 'hash',
  '?': 'question',
  '!': 'exclamation',
};

const spell = ({
  body, flags, text, say,
}) => {
  const prefix = flags[0]?.includes('y') ? 'alphabet-yellow-' : 'alphabet-white-';

  let out = '';

  for (const character of text) {
    if (RE_ALPHA.exec(character) !== null) {
      out += `:${prefix}${character}:`;
    } else if (character === ' ') {
      out += ':spacer:';
    } else if (character in SPECIAL_CHARACTERS) {
      out += `:${prefix}${SPECIAL_CHARACTERS[character]}:`;
    } else {
      out += character;
    }
  }

  respond(say, body, out);
};

export default spell;
