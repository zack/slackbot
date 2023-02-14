import { respond } from '../utils/respond';

const RE_ALPHA = /[a-zA-Z]/;

const randBool = () => Math.random() < 0.5;

const spongecase = ({ say, body, text }) => {
  let up = randBool();
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

const randcase = ({ say, body, text }) => {
  let up = randBool();
  let out = '';

  for (const character of text) {
    if (RE_ALPHA.exec(character) !== null) {
      out += up ? character.toUpperCase() : character.toLowerCase();
      up = randBool();
    } else {
      out += character;
    }
  }

  respond(say, body, out);
};

export { spongecase, randcase };
