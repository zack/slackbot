import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import ImageSearch from 'image-search-google';
import { respond, respondThreaded } from '../utils/respond';

import sample from '../utils/sample';

dotenv.config();

let ENABLED = false;
let SEARCHCLIENT;

if (process.env.SEARCH_ENGINE_ID !== undefined && process.env.GOOGLE_SEARCH_API_KEY !== undefined) {
  try {
    SEARCHCLIENT = new ImageSearch(
      process.env.SEARCH_ENGINE_ID,
      process.env.GOOGLE_SEARCH_API_KEY,
    );
    ENABLED = true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

const summon = async ({
  body, text, say,
}) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided in `.env`.');
    return;
  }

  const response = await SEARCHCLIENT.search(text);
  const image = sample(response);
  respond(say, body, `<${image.url}|${text}>`);
};

export default summon;
