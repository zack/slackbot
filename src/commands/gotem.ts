const gotem = async ({ app, body }) => {
  const timestamp = body.event.item.ts;
  const { channel } = body.event.item;

  // eslint-disable-next-line no-promise-executor-return
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const letters = 'gotem'.split('');

  async function run() {
    for (let i = 0; i < 5; i++) {
      app.client.reactions.add({
        channel,
        name: `alphabet-yellow-${letters[i]}`,
        timestamp,
      });

      // eslint-disable-next-line no-await-in-loop
      await timer(500);
    }
  }

  run();
};

export default gotem;
