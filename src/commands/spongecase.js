const RE_ALPHA = /[a-zA-Z]/;

const spongecase = ({ text, say }) => {
  let up = true;
  let out = '';

  for (const character of text) {
    if (RE_ALPHA.exec(character) !== null) {
      out += up ? character.toUpperCase() : character.toLowerCase();
      up = !up;
    } else {
      out += character;
    }
  }

  say(out);
};

export default spongecase;
