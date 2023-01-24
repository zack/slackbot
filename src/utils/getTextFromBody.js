const getTextFromBody = async (app, body) => {
  const messageTs = body.event.item.ts;
  const { channel } = body.event.item;

  const history = await app.client.conversations.history({
    channel,
    inclusive: true,
    oldest: messageTs,
    limit: 1,
  });

  return (history.messages[0].text);
};

export default getTextFromBody;
