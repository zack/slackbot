import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import giphy from 'giphy-api';
import { respond } from '../utils/respond';

import sample from '../utils/sample';

dotenv.config();

const giphyClient = giphy(process.env.GIPHY_API_KEY);

const RATING = process.env.GIPHY_RATING;

const gif = async ({
  body, text, say,
}) => {
  const response = await giphyClient.search({ q: text, rating: RATING, limit: 25 });
  const giff = sample(response.data);

  respond(say, body, `<${giff.images.original.url}|${text}>`);
};

export default gif;
