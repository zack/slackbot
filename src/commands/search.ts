import Database from 'better-sqlite3';

import { respondThreaded } from '../utils/respond';

const db = new Database('./db/local.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage

const RESULT_LIMIT = 3;
const RE_USER = /^<@[^>]+>$/;

// % and _ are LIKE wildcards; escape them so a literal search for e.g.
// "50%" doesn't match anything starting with "50".
const escapeLike = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

const search = async ({ body, say, text }) => {
  const args = text.split(' ');
  const learnee = RE_USER.test(args[0]) ? args[0] : undefined;
  const query = learnee ? args.slice(1).join(' ') : text;
  const likeQuery = `%${escapeLike(query)}%`;

  let total;
  let hits;
  if (learnee) {
    ({ total } = db
      .prepare("SELECT count(*) as total FROM learn WHERE learnee = ? AND lower(content) LIKE lower(?) ESCAPE '\\'")
      .get(learnee, likeQuery));

    hits = db
      .prepare("SELECT content FROM learn WHERE learnee = ? AND lower(content) LIKE lower(?) ESCAPE '\\' ORDER BY RANDOM() LIMIT ?")
      .all(learnee, likeQuery, RESULT_LIMIT);
  } else {
    ({ total } = db
      .prepare("SELECT count(*) as total FROM learn WHERE lower(content) LIKE lower(?) ESCAPE '\\'")
      .get(likeQuery));

    hits = db
      .prepare("SELECT learnee, content FROM learn WHERE lower(content) LIKE lower(?) ESCAPE '\\' ORDER BY RANDOM() LIMIT ?")
      .all(likeQuery, RESULT_LIMIT);
  }

  let out;
  if (total > 0) {
    const forWhom = learnee ? ` for ${learnee}` : '';
    const lines = learnee
      ? hits.map(({ content }) => `- ${content}`)
      : hits.map(({ learnee: hitLearnee, content }) => `${hitLearnee}: ${content}`);

    const randLine = hits.length < total ? 'a random ' : '';
    out = `Showing ${randLine} ${hits.length} of ${total} hit${total === 1 ? '' : 's'}${forWhom} matching "${query}":\n${lines.join('\n')}`;
  } else {
    out = `No hits${learnee ? ` for ${learnee}` : ''} matching "${query}".`;
  }

  respondThreaded(say, body, out);
};

export default search;
