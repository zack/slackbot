const gotem = async ({ app, body }) => {
  const timestamp = body.event.item.ts;
  const { channel } = body.event.item;

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const letters = 'gotem'.split('');

  async function run() {
    for (let i = 0; i < 5; i++) {
      app.client.reactions.add({
        channel,
        name: `alphabet-yellow-${letters[i]}`,
        timestamp,
      }).catch((err) => {
        console.error('gotem: failed to add reaction', err);
      });

      await timer(500);
    }
  }

  run().catch((err) => {
    console.error('gotem: failed', err);
  });
};

export default gotem;
