import { respond } from '../utils/respond.js';

const RE_ALPHA = /[a-zA-Z]/;

const spongecase = ({ say, body, text }) => {
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

  respond(say, body, out);
};

export default spongecase;
