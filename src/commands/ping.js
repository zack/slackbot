const pong = ({ app, body }) => {
  const timestamp = body.event.ts;
  const { channel } = body.event;

  app.client.reactions.add({
    channel,
    name: 'table_tennis_paddle_and_ball',
    timestamp,
  });
};

export default pong;
