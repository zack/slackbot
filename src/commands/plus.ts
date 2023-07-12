import cleanUser from '../utils/cleanUser';
import Plus from '../entity/Plus';
import { respond, respondThreaded } from '../utils/respond';
import verifyUser from '../utils/verifyUser';

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
    const newPlus = new Plus();
    newPlus.plusee = plusee;
    newPlus.pluser = pluser;
    newPlus.note = note || '';
    await newPlus.save();

    const pluses = await Plus.findBy({ plusee });
    const plusCount = pluses.length;

    const forNote = note.length > 0 ? `for *${note}*` : '';
    out = `${pluserName} has plussed <@${plusee}> ${forNote}. <@${plusee}> now has *${plusCount} ${plusCount === 1 ? 'plus' : 'pluses'}*!`;
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

  const plusesData = await Plus.findBy({ plusee });
  const plusCount = plusesData.length;

  const out = `<@${plusee}> has *${plusCount} ${plusCount === 1 ? 'plus' : 'pluses'}*!`;

  respond(say, body, out);
};

export {
  multiPlus, plusCommand, plusEmoji, pluses,
};
