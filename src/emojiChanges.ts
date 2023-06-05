const announceEmojiChange = (app, body, channel) => {
  const { subtype } = body.event;
  const { value } = body.event;

  let out;

  if (value && value.includes('alias')) {
    const { name } = body.event;
    const existing = value.split(':')[1];

    out = `*New emoji alias added:* :${name}: \`${name}\` for \`${existing}\``;
  } else if (subtype === 'add') {
    const { name } = body.event;

    out = `*New emoji added:* :${name}: \`${name}\``;
  } else if (subtype === 'remove') {
    const { names } = body.event;

    out = `*Emoji removed:* \`${names[0]}\``;
  }

  app.client.chat.postMessage({ channel, text: out });
};

export default announceEmojiChange;
