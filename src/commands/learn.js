import Database from 'better-sqlite3';

import cleanUser from '../utils/cleanUser.js';
import getTextFromBody from '../utils/getTextFromBody.js';
import sample from '../utils/sample.js';
import verifyUser from '../utils/verifyUser.js';
import { respond, respondThreaded } from '../utils/respond.js';

const RE_USER = /^<@.*>$/;

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
  const learnee = (RE_USER.exec(text) !== null)
    ? cleanUser(text)
    : text;

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

      if (await verifyUser(app, learnee)) {
        out = `Learned about <@${learnee}> (by ${learnerName})!`;
      } else {
        out = `Learned about ${learnee} (by ${learnerName})!`;
      }

      respondThreaded(say, body, out);
    } catch {
      respondThreaded(say, body, 'I already know that.');
    }
  } else {
    out = 'No empty learns!';
  }
};

const learnCommand = async ({
  app, body, text, say,
}) => {
  const args = text.split(' ');
  const learnee = (RE_USER.exec(args[0]) !== null)
    ? cleanUser(args[0])
    : args[0];
  const learner = body.event.user;
  const learnerProfile = await app.client.users.info({ user: learner });
  const learnerName = learnerProfile.user.profile.display_name;

  if (RE_USER.exec(text) && !(await verifyUser(app, learnee))) {
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
