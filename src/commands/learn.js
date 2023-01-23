import Database from 'better-sqlite3';

import cleanUser from '../utils/cleanUser.js';
import { respondThreaded } from '../utils/respond.js';
import verifyUser from '../utils/verifyUser.js';

const db = new Database('../learns.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage
db.exec('CREATE TABLE IF NOT EXISTS learns(learnee TEXT, learner TEXT, note TEXT, ts DATETIME DEFAULT CURRENT_TIMESTAMP)');

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

  const note = args.slice(1).join(' ');

  db.prepare('INSERT INTO learns(learnee, learner, note) values (?, ?, ?)').run(learnee, learner, note);

  const out = `Learned about <@${learnee}> (by ${learnerName})!`;

  respondThreaded(say, body, out);
};

export default learn;
