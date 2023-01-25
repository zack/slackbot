import sample from '../utils/sample';
import getAllEmojis from '../utils/getAllEmojis';

const emojibomb = async ({ app, body }) => {
  const timestamp = body.event.ts;
  const { channel } = body.event;

  const emojiList = await getAllEmojis(app);

  // Limit appears to be somewhere between 21 and 23 depending on the workspace
  for (let i = 0; i < 23; i++) {
    app.client.reactions.add({
      channel,
      name: sample(emojiList),
      timestamp,
    });
  }
};

export default emojibomb;
