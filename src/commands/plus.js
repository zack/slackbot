import Database from 'better-sqlite3';

import cleanUser from '../utils/cleanUser.js';
import { respondThreaded } from '../utils/respond.js';
import verifyUser from '../utils/verifyUser.js';

const db = new Database('../pluses.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage
db.exec('CREATE TABLE IF NOT EXISTS pluses(plusee TEXT, pluser TEXT, note TEXT, ts DATETIME DEFAULT CURRENT_TIMESTAMP)');

const getNote = (args) => {
  if (args.length === 1) {
    return '';
  } else if (args[1].toLowerCase() === 'for') {
    return args.slice(2).join(' ');
  } else {
    return args.join(' ');
  }
};

const plus = async ({
  app, body, text, say,
}) => {
  const args = text.split(' ');
  const plusee = cleanUser(args[0]);
  const pluser = body.event.user;
  const pluserProfile = await app.client.users.info({ user: pluser });
  const pluserName = pluserProfile.user.profile.display_name;

  if (!(await verifyUser(app, plusee))) {
    respondThreaded(say, body, "Sorry, I don't know who that is.");
    return;
  }

  const note = getNote(args);

  let out;
  if (pluser === plusee) {
    out = 'Hey, no plussing yourself.';
  } else {
    db.prepare('INSERT INTO pluses(plusee, pluser, note) values (?, ?, ?)').run(plusee, pluser, note);
    const { pluses } = db.prepare('SELECT count(*) as pluses FROM pluses WHERE plusee = ?').get(plusee);

    const forNote = note.length > 0 ? `for *${note}*` : '';
    out = `${pluserName} has plussed <@${plusee}> ${forNote}. <@${plusee}> now has *${pluses} pluses*!`;
  }

  respondThreaded(say, body, out);
};

export default plus;
