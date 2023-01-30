import { respond } from '../utils/respond';

const ts = async ({ body, flags, say }) => {
  if (flags.length > 0 && flags[0][0] === 'm') {
    // milliseconds since epoch
    respond(say, body, `${Date.now()}`);
  } else {
    // seconds since epoch
    respond(say, body, `${Math.round(Date.now() / 1000)}`);
  }
};

export default ts;
