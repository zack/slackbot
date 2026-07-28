import * as dotenv from 'dotenv';

import finnhub = require('finnhub');

import { respond, respondThreaded } from '../utils/respond'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config({ quiet: true });

let ENABLED = false;
let finnhubClient;

if (process.env.FINNHUB_API_KEY !== undefined && process.env.FINNHUB_API_KEY.trim() !== '') {
  try {
    finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_API_KEY);
    ENABLED = true;
  } catch (e) {
    console.error(e);
  }
}

const stock = async ({ body, say, text }) => {
  if (!ENABLED) {
    respondThreaded(say, body, 'This command is not enabled. Likely, no valid API key was provided in `.env`.');
    return;
  }

  finnhubClient.quote(text, (error, data) => {
    if (data.c > 0) {
      respond(say, body, `Current price for *${text.toUpperCase()}*: $${data.c}`);
    } else {
      respondThreaded(say, body, 'Price is $0. Is that a real stock?');
    }
  });
};

export default stock;
