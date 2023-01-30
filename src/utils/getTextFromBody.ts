const getReplies = async (app, body) => {
  const channel = body.event.item?.channel || body.event.channel;
  const timestamp = body.event.item?.ts || body.event.ts;

  const replies = await app.client.conversations.replies({
    channel,
    inclusive: true,
    limit: 1,
    ts: timestamp,
  });

  return (replies);
};

const getTextFromBody = async (app, body) => {
  const replies = await getReplies(app, body);
  return (replies.messages[0].text);
};

const getTextAndFileFromBody = async (app, body) => {
  const replies = await getReplies(app, body);
  const message = replies.messages[0];
  let content = message.text;

  if (message.files?.length > 0) {
    content = `${content} (<${message.files[0].url_private}|file>)`;
  }

  return content;
};

export { getTextFromBody, getTextAndFileFromBody };
