const RE_ALPHA = /[a-zA-Z]/;

const SPECIAL_CHARACTERS = {
  '#': 'hash',
  '?': 'question',
  '!': 'exclamation',
};

const spell = ({
  flags, text, say,
}) => {
  const prefix = flags.includes('y') ? 'alphabet-yellow-' : 'alphabet-white-';

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

  say(out);
};

export default spell;
