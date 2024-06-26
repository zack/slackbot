import Database from 'better-sqlite3';

import cleanUser from '../utils/cleanUser';
import { respond, respondThreaded } from '../utils/respond';
import verifyUser from '../utils/verifyUser';

const db = new Database('./db/local.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage
db.exec('CREATE TABLE IF NOT EXISTS plus(plusee TEXT, pluser TEXT, note TEXT, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP)');

const getNote = (args) => {
  if (args.length === 1) {
    return '';
  } else if (args[1].toLowerCase() === 'for') {
    return args.slice(2).join(' ');
  } else {
    return args.join(' ');
  }
};

const plus = async (app, body, note, plusee, pluser, say) => {
  if (!(await verifyUser(app, plusee))) {
    respondThreaded(say, body, `Sorry, I don't know who *${plusee}* is.`);
    return;
  }

  const pluserProfile = await app.client.users.info({ user: pluser });
  const pluserName = pluserProfile.user.profile.display_name || pluserProfile.user.real_name;

  let out;
  if (pluser === plusee) {
    out = 'Hey, no plussing yourself.';
  } else {
    db.prepare('INSERT INTO plus(plusee, pluser, note) values (?, ?, ?)').run(plusee, pluser, note);
    const { pluses } = db.prepare('SELECT count(*) as pluses FROM plus WHERE plusee = ?').get(plusee);

    const forNote = note.length > 0 ? `for *${note}*` : '';
    out = `${pluserName} has plussed <@${plusee}> ${forNote}. <@${plusee}> now has *${pluses} ${pluses === 1 ? 'plus' : 'pluses'}*!`;
  }

  respondThreaded(say, body, out);
};

const multiPlus = async ({
  app, body, text, say,
}) => {
  const args = text.split(' ');
  const plusees = args.map(cleanUser);
  const pluser = body.event.user;

  plusees.forEach(async (plusee) => {
    if (!(await verifyUser(app, plusee))) {
      respondThreaded(say, body, `Sorry, I don't know who *${plusee}* is.`);
      return;
    }

    plus(app, body, '', plusee, pluser, say);
  });
};

const plusCommand = async ({
  app, body, text, say,
}) => {
  const args = text.split(' ');
  const plusee = cleanUser(args[0]);
  const pluser = body.event.user;

  if (!(await verifyUser(app, plusee))) {
    respondThreaded(say, body, `Sorry, I don't know who *${plusee}* is.`);
    return;
  }

  const note = getNote(args);

  plus(app, body, note, plusee, pluser, say);
};

const plusEmoji = async ({
  app, body, say,
}) => {
  const plusee = body.event.item_user;
  const pluser = body.event.user;
  const note = '';

  plus(app, body, note, plusee, pluser, say);
};

const pluses = async ({
  app, body, text, say,
}) => {
  const args = text.split(' ');
  const plusee = cleanUser(args[0]);

  if (!(await verifyUser(app, plusee))) {
    respondThreaded(say, body, `Sorry, I don't know who ${plusee} is.`);
    return;
  }

  const { plusCount } = db.prepare('SELECT count(*) as plusCount FROM plus WHERE plusee = ?').get(plusee);

  const out = `<@${plusee}> has *${plusCount} ${plusCount === 1 ? 'plus' : 'pluses'}*!`;

  respond(say, body, out);
};

export {
  multiPlus, plusCommand, plusEmoji, pluses,
};
