const getAllEmojis = async (app) => {
  const response = await app.client.emoji.list({ include_categories: true });

  // This is just custom emojis
  let emojiList = Object.keys(response.emoji);

  // This is all the rest of the built-in emojis
  for (const category of response.categories) {
    emojiList = [
      ...emojiList,
      ...category.emoji_names,
    ];
  }

  return emojiList;
};

export default getAllEmojis;
