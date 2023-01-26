import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import ImageSearch from 'image-search-google';
import { respond } from '../utils/respond';

dotenv.config();

const searchClient = new ImageSearch(
  process.env.SEARCH_ENGINE_ID,
  process.env.GOOGLE_SEARCH_API_KEY,
);
const OPTIONS = { page: 1 };

const pong = async ({
  body, text, say,
}) => {
  const response = await searchClient.search(text, OPTIONS);
  respond(say, body, `<${response[0].url}|${text}>`);
};

export default pong;
