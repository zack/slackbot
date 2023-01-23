import Database from 'better-sqlite3';

import cleanUser from '../utils/cleanUser.js';
import { respondThreaded } from '../utils/respond.js';
import verifyUser from '../utils/verifyUser.js';

const db = new Database('../learns.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage
db.exec('CREATE TABLE IF NOT EXISTS learns(learnee TEXT, learner TEXT, content TEXT, ts DATETIME DEFAULT CURRENT_TIMESTAMP)');

const learn = async ({
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

  db.prepare('INSERT INTO learns(learnee, learner, content) values (?, ?, ?)').run(learnee, learner, content);

  const out = `Learned about <@${learnee}> (by ${learnerName})!`;

  respondThreaded(say, body, out);
};

const unlearn = async ({
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

  const { changes } = db.prepare('DELETE FROM learns where learnee = ? and content = ?').run(learnee, content);

  const out = changes > 0
    ? `Unlearned about <@${learnee}> (by ${learnerName})!`
    : "I don't think I knew that. I certainly don't know it now.";

  respondThreaded(say, body, out);
};

export { learn, unlearn };
