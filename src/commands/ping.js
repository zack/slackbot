import sample from '../utils/sample.js';
import getAllEmojis from '../utils/getAllEmojis.js';

const pong = async ({ app, body }) => {
  const timestamp = body.event.ts;
  const { channel } = body.event;

  const emojiList = await getAllEmojis(app);

  app.client.reactions.add({
    channel,
    name: sample(emojiList),
    timestamp,
  });
};

export default pong;
