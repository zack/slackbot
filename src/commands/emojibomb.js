import emojis from '../constants/emojis.js';
import sample from '../utils/sample.js';

const emojibomb = ({ app, body }) => {
  const timestamp = body.event.ts;
  const { channel } = body.event;
  let emoji;

  // 23 is the limit per person (or in this case, bot)
  for (let i = 0; i < 23; i++) {
    emoji = sample(emojis);

    app.client.reactions.add({
      channel,
      name: emoji,
      timestamp,
    });
  }
};

export default emojibomb;
