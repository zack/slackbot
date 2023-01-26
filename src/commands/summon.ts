import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import ImageSearch from 'image-search-google';
import { respond } from '../utils/respond';

import sample from '../utils/sample';

dotenv.config();

const searchClient = new ImageSearch(
  process.env.SEARCH_ENGINE_ID,
  process.env.GOOGLE_SEARCH_API_KEY,
);

const summon = async ({
  body, text, say,
}) => {
  const response = await searchClient.search(text);
  const image = sample(response);
  respond(say, body, `<${image.url}|${text}>`);
};

export default summon;
