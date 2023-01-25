import Database from 'better-sqlite3';

import getTextFromBody from '../utils/getTextFromBody';
import sample from '../utils/sample';
import { respond, respondThreaded } from '../utils/respond';

const db = new Database('../learns.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage
db.exec(`CREATE TABLE IF NOT EXISTS learns(
                learnee TEXT,
                learner TEXT,
                content TEXT,
                ts DATETIME DEFAULT CURRENT_TIMESTAMP,
                unique(learnee, content))`);

const gimme = async ({
  body, say, text,
}) => {
  const learnee = text;

  const learns = db.prepare('SELECT content, ts FROM learns WHERE learnee = ?').all(learnee);

  let out;
  if (learns.length > 0) {
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
      db.prepare('INSERT INTO learns(learnee, learner, content) values (?, ?, ?)').run(learnee, learner, content);

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
  const content = args.slice(1).join(' ');
  const learnee = args[0];
  const learner = body.event.user;
  const learnerProfile = await app.client.users.info({ user: learner });
  const learnerName = learnerProfile.user.profile.display_name;

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
  const { changes } = db.prepare('DELETE FROM learns where learnee = ? and content = ?').run(learnee, content);

  const out = changes > 0
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
  const content = await getTextFromBody(app, body);
  const learnee = `<@${body.event.item_user}>`;
  const learner = body.event.user;
  const learnerProfile = await app.client.users.info({ user: learner });
  const learnerName = learnerProfile.user.profile.display_name;

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
