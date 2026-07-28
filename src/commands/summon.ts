import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { respond, respondThreaded } from '../utils/respond';

import sample from '../utils/sample';

dotenv.config({ quiet: true });

const { SEARCH_ENGINE_ID, GOOGLE_SEARCH_API_KEY } = process.env;
const ENABLED = SEARCH_ENGINE_ID !== undefined && GOOGLE_SEARCH_API_KEY !== undefined;

type ImageResult = {
  url: string;
  thumbnail: string;
  snippet: string;
  context: string;
};

const searchImages = async (query: string): Promise<ImageResult[]> => {
  const params = new URLSearchParams({
    q: query.replace(/\s/g, '+'),
    searchType: 'image',
    cx: SEARCH_ENGINE_ID as string,
    key: GOOGLE_SEARCH_API_KEY as string,
  });

  const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
  const body = await res.json();

  return (body.items || []).map((item) => ({
    url: item.link,
    thumbnail: item.image.thumbnailLink,
    snippet: item.title,
    context: item.image.contextLink,
  }));
};

const summon = async ({
  body, text, say,
}) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided in `.env`.');
    return;
  }

  const response = await searchImages(text);
  const image = sample(response);
  respond(say, body, `<${image.url}|${text}>`);
};

export default summon;
