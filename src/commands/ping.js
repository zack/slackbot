import emojis from '../constants/emojis.js';
import sample from '../utils/sample.js';

const pong = ({ app, body }) => {
  const timestamp = body.event.ts;
  const { channel } = body.event;
  const emoji = sample(emojis);

  app.client.reactions.add({
    channel,
    name: emoji,
    timestamp,
  });
};

export default pong;
