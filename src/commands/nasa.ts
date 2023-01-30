import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import { respond, respondThreaded } from '../utils/respond';

dotenv.config();

let ENABLED = true;
const APOD_URL = 'https://api.nasa.gov/planetary/apod?';

if (process.env.NASA_API_KEY === undefined || process.env.NASA_API_KEY === '') {
  ENABLED = false;
}

const apod = async ({ body, say, text }) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided in `.env`.');
    return;
  }

  const response = await fetch(APOD_URL + new URLSearchParams({
    api_key: process.env.NASA_API_KEY || '',
    date: text,
  }));

  if (response.status !== 200) {
    respondThreaded(say, body, 'Bad request.');
    return;
  }

  const {
    date, explanation, hdurl, media_type: mediaType, title, url,
  } = await response.json();

  // If it's not an image, it's a video, and videos just have a url
  const urler = mediaType === 'image' ? hdurl : url;

  respond(say, body, `*Date:* ${date}\n
*Title:* ${title}\n
*Explanation:* ${explanation}\n
*URL:* ${urler}
  `);
};

export default apod;
