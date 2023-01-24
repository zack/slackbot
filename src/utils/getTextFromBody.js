const getTextFromBody = async (app, body) => {
  const messageTs = body.event.item.ts;
  const { channel } = body.event.item;

  const replies = await app.client.conversations.replies({
    channel,
    inclusive: true,
    ts: messageTs,
    limit: 1,
  });

  return (replies.messages[0].text);
};

export default getTextFromBody;
