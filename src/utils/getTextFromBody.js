const getTextFromBody = async (app, body) => {
  const channel = body.event.item?.channel || body.event.channel;
  const timestamp = body.event.item?.ts || body.event.ts;

  const replies = await app.client.conversations.replies({
    channel,
    inclusive: true,
    limit: 1,
    ts: timestamp,
  });

  return (replies.messages[0].text);
};

export default getTextFromBody;
