import { respondThreaded } from '../utils/respond';
/*
 * const getEmojiData = async (app, body) => {
 *   const content = await getTextAndFileFromBody(app, body);
 *   const learnee = `<@${body.event.item_user}>`;
 *   const learner = body.event.user;
 *   const learnerName = await getLearnerName(app, learner);
 *
 *   return {
 *     content,
 *     learnee,
 *     learner,
 *     learnerName,
 *   };
 * };
 *
 * const learnEmoji = async ({
 *   app, body, say,
 * }) => {
 *   const {
 *     content,
 *     learnee,
 *     learner,
 *     learnerName,
 *   } = await getEmojiData(app, body);
 *
 *   learn(app, body, content, learnee, learner, learnerName, say);
 * };
 */

const deleteThis = async ({
  app, body, say,
}) => {
  const channel = body.event.item?.channel || body.event.channel;
  const ts = body.event.item?.ts || body.event.ts;

  const replies = await app.client.conversations.replies({
    channel,
    inclusive: true,
    limit: 1,
    ts,
  });

  // We check against the bot's user ID here as well since some API calls
  // (notably the file upload call, which is used for ?aiart) create messages
  // that are associated with the bot's user ID instead of the bot's bot ID.

  const message = replies.messages[0];
  const messageBotId = message.bot_id || message.user;
  const messageUserId = message.user;
  const thisBotBotId = (await app.client.auth.test()).bot_id;
  const thisBotUserId = (await app.client.auth.test()).user_id;
  let replaceText = `Message deleted (by <@${body.event.user}>)`;

  const { files } = message;

  if (files?.length > 0) {
    for (const { id } of files) {
      app.client.files.delete({ file: id });
    }

    replaceText += `, including ${files.length} file${files.length === 1 ? '' : 's'}.`;
  }

  if (thisBotBotId === messageBotId || thisBotUserId === messageUserId) {
    await app.client.chat.update({
      attachments: [],
      channel,
      // file_ids: [],
      text: replaceText,
      ts,
    });
  } else {
    respondThreaded(say, body, `Can only delete messages from <@${thisBotUserId}>`);
  }
};

export default deleteThis;
