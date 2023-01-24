import Database from 'better-sqlite3';

import cleanUser from '../utils/cleanUser.js';
import getTextFromBody from '../utils/getTextFromBody.js';
import sample from '../utils/sample.js';
import verifyUser from '../utils/verifyUser.js';
import { respond, respondThreaded } from '../utils/respond.js';

const db = new Database('../learns.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage
db.exec('CREATE TABLE IF NOT EXISTS learns(learnee TEXT, learner TEXT, content TEXT, ts DATETIME DEFAULT CURRENT_TIMESTAMP)');

const gimme = async ({
  app, body, say, text,
}) => {
  const args = text.split(' ');
  const learnee = cleanUser(args[0]);

  if (!(await verifyUser(app, learnee))) {
    respondThreaded(say, body, "Sorry, I don't know who that is.");
    return;
  }

  const learns = db.prepare('SELECT content, ts FROM learns WHERE learnee = ?').all(learnee);
  const { content } = sample(learns);

  respond(say, body, content);
};

const learn = async (app, body, content, learnee, learner, learnerName, say) => {
  if (!(await verifyUser(app, learnee))) {
    respondThreaded(say, body, "Sorry, I don't know who that is.");
    return;
  }

  db.prepare('INSERT INTO learns(learnee, learner, content) values (?, ?, ?)').run(learnee, learner, content);

  const out = `Learned about <@${learnee}> (by ${learnerName})!`;

  respondThreaded(say, body, out);
};

const learnCommand = async ({
  app, body, text, say,
}) => {
  const args = text.split(' ');
  const learnee = cleanUser(args[0]);
  const learner = body.event.user;
  const learnerProfile = await app.client.users.info({ user: learner });
  const learnerName = learnerProfile.user.profile.display_name;

  if (!(await verifyUser(app, learnee))) {
    respondThreaded(say, body, "Sorry, I don't know who that is.");
    return;
  }

  const content = args.slice(1).join(' ');

  learn(app, body, content, learnee, learner, learnerName, say);
};

const unlearn = async (app, body, content, learnee, unlearnerName, say) => {
  if (!(await verifyUser(app, learnee))) {
    respondThreaded(say, body, "Sorry, I don't know who that is.");
    return;
  }

  const { changes } = db.prepare('DELETE FROM learns where learnee = ? and content = ?').run(learnee, content);

  const out = changes > 0
    ? `Unlearned about <@${learnee}> (by ${unlearnerName})!`
    : "I don't think I knew that. I certainly don't know it now.";

  respondThreaded(say, body, out);
};

const unlearnCommand = async ({
  app, body, text, say,
}) => {
  const args = text.split(' ');
  const learnee = cleanUser(args[0]);
  const unlearner = body.event.user;
  const unlearnerProfile = await app.client.users.info({ user: unlearner });
  const unlearnerName = unlearnerProfile.user.profile.display_name;

  if (!(await verifyUser(app, learnee))) {
    respondThreaded(say, body, "Sorry, I don't know who that is.");
    return;
  }

  const content = args.slice(1).join(' ');

  unlearn(app, body, content, learnee, unlearnerName, say);
};

const learnEmoji = async ({
  app, body, say,
}) => {
  const learnee = body.event.item_user;
  const learner = body.event.user;
  const learnerProfile = await app.client.users.info({ user: learner });
  const learnerName = learnerProfile.user.profile.display_name;

  const content = await getTextFromBody(app, body);

  learn(app, body, content, learnee, learner, learnerName, say);
};

const unlearnEmoji = async ({
  app, body, say,
}) => {
  const learnee = body.event.item_user;
  const unlearner = body.event.user;
  const unlearnerProfile = await app.client.users.info({ user: unlearner });
  const unlearnerName = unlearnerProfile.user.profile.display_name;

  const content = await getTextFromBody(app, body);

  unlearn(app, body, content, learnee, unlearnerName, say);
};

export {
  gimme, learnCommand, learnEmoji, unlearnCommand, unlearnEmoji,
};
