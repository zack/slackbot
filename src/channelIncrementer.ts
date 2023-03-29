const incrementChannelName = async (app, channel, token) => {
  const fetch = await app.client.conversations.info({ channel });
  const { name } = fetch.channel;
  const channelNameTokens = name.split('-');

  const newChannelName = channelNameTokens.map((tk) => {
    const tokenIsHexVal = tk.match(/^0x[0-9a-f]+$/);
    const parsedToken = parseInt(tk, 16);
    const parsedTokenIsNumber = !Number.isNaN(parsedToken);

    if (tokenIsHexVal && parsedTokenIsNumber) {
      return `0x${(parsedToken + 1).toString(16)}`;
    } else {
      return tk;
    }
  }).join('-');

  app.client.conversations.rename({ token, channel, name: newChannelName });
};

export default incrementChannelName;
