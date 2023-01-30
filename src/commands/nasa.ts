import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import {
  parse as parseDate, isBefore as dateIsBefore, isFuture as dateIsFuture, subMonths,
} from 'date-fns';
import { respond, respondThreaded } from '../utils/respond';
import sample from '../utils/sample';

dotenv.config();

let ENABLED = true;
const APOD_URL = 'https://api.nasa.gov/planetary/apod?';
const CURIOUSITY_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?';
const CURIOUSITY_SOL_ZERO = new Date('2012-08-06');

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

const curiousity = async ({ body, say, text }) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided in `.env`.');
    return;
  }

  // Looks like this should be safe...
  const defaultDate = subMonths(new Date(), 2);

  let date;
  let earthDate;
  try {
    date = text ? parseDate(text, 'y-MM-dd', new Date()) : defaultDate;
    earthDate = date.toISOString().slice(0, 10);
  } catch {
    respondThreaded(say, body, 'Bad date format. Use `YYYY-MM-DD`.');
    return;
  }

  if (dateIsBefore(date, CURIOUSITY_SOL_ZERO)) {
    respondThreaded(say, body, 'Date too early. Curiousity landed on 2012-08-06');
    return;
  }

  if (dateIsFuture(date)) {
    respondThreaded(say, body, 'We cannot yet get photos from the future');
    return;
  }

  const response = await fetch(CURIOUSITY_URL + new URLSearchParams({
    api_key: process.env.NASA_API_KEY || '',
    earth_date: earthDate,
  }));

  if (response.status !== 200) {
    respondThreaded(say, body, 'Bad request.');
    return;
  }

  const json = await response.json();

  const { photos } = json;

  if (photos.length === 0) {
    respondThreaded(say, body, 'No photos.');
    return;
  }

  const photo = sample(photos);

  respond(say, body, `*Earth Date:* ${photo.earth_date}\n
*Camera:* ${photo.camera.full_name}\n
*Image URL:* ${photo.img_src}
  `);
};

export { apod, curiousity };
