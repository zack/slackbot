import Learn from '../entity/Learn';
import { getTextAndFileFromBody } from '../utils/getTextFromBody';
import sample from '../utils/sample';
import { respond, respondThreaded } from '../utils/respond';

const getLearnerName = async (app, user) => {
  const learnerProfile = await app.client.users.info({ user });
  return learnerProfile.user.profile.display_name || learnerProfile.user.profile.real_name;
};

const gimme = async ({
  body, say, text,
}) => {
  const learnee = text.split(' ')[0];
  const index = parseInt(text.split(' ')[1], 10);

  const learns = await Learn.findBy({ learnee });

  let out;
  if (learns.length > 0 && !Number.isNaN(index) && index > 0 && index <= learns.length) {
    const { content } = learns[index - 1];
    out = content;
  } else if (learns.length > 0) {
    const { content } = sample(learns);
    out = content;
  } else {
    out = 'I got nothin.';
  }

  respond(say, body, out);
};

const learn = async (app, body, content, learnee, learner, learnerName, say) => {
  let out;

  if (content.trim().length > 0) {
    try {
      const newLearn = new Learn();
      newLearn.learnee = learnee;
      newLearn.learner = learner;
      newLearn.content = content;
      await newLearn.save();

      out = `Learned about ${learnee} (by ${learnerName})!`;
    } catch {
      out = 'I already know that.';
    }
  } else {
    out = 'No empty learns!';
  }

  respondThreaded(say, body, out);
};

const getCommandData = async (app, body, text) => {
  const args = text.split(' ');
  const learnee = args[0];
  const learner = body.event.user;
  const learnerName = await getLearnerName(app, learner);

  let content = args.slice(1).join(' ');

  if (body.event.files?.length > 0) {
    content = `${content} (<${body.event.files[0].url_private}|file>)`;
  }

  return {
    content,
    learnee,
    learner,
    learnerName,
  };
};

const learnCommand = async ({
  app, body, text, say,
}) => {
  const {
    content,
    learnee,
    learner,
    learnerName,
  } = await getCommandData(app, body, text);

  learn(app, body, content, learnee, learner, learnerName, say);
};

const unlearn = async (app, body, content, learnee, unlearnerName, say) => {
  const deleteResult = await Learn.delete({ learnee, content });

  const out = deleteResult.affected && deleteResult.affected > 0
    ? `Unlearned about ${learnee} (by ${unlearnerName})!`
    : "I don't think I knew that. I certainly don't know it now.";

  respondThreaded(say, body, out);
};

const unlearnCommand = async ({
  app, body, text, say,
}) => {
  const {
    content,
    learnee,
    learnerName,
  } = await getCommandData(app, body, text);

  unlearn(app, body, content, learnee, learnerName, say);
};

const getEmojiData = async (app, body) => {
  const content = await getTextAndFileFromBody(app, body);
  const learnee = `<@${body.event.item_user}>`;
  const learner = body.event.user;
  const learnerName = await getLearnerName(app, learner);

  return {
    content,
    learnee,
    learner,
    learnerName,
  };
};

const learnEmoji = async ({
  app, body, say,
}) => {
  const {
    content,
    learnee,
    learner,
    learnerName,
  } = await getEmojiData(app, body);

  learn(app, body, content, learnee, learner, learnerName, say);
};

const unlearnEmoji = async ({
  app, body, say,
}) => {
  const {
    content,
    learnee,
    learnerName,
  } = await getEmojiData(app, body);

  unlearn(app, body, content, learnee, learnerName, say);
};

export {
  gimme, learnCommand, learnEmoji, unlearnCommand, unlearnEmoji,
};
