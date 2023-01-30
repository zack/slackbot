import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import giphy from 'giphy-api';
import { respond, respondThreaded } from '../utils/respond';

import sample from '../utils/sample';

dotenv.config();

let ENABLED;
let GIPHYCLIENT;
const RATING = process.env.GIPHY_RATING;

if (process.env.GIPHY_API_KEY !== undefined && process.env.GIPHY_API_KEY === ' ') {
  try {
    GIPHYCLIENT = giphy(process.env.GIPHY_API_KEY);
    ENABLED = true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

const gif = async ({
  body, text, say,
}) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided in `.env`.');
    return;
  }

  const response = await GIPHYCLIENT.search({ q: text, rating: RATING, limit: 25 });
  const giff = sample(response.data);

  respond(say, body, `<${giff.images.original.url}|${text}>`);
};

export default gif;
