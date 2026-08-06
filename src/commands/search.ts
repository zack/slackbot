import Database from 'better-sqlite3';

import { respondUnthreaded } from '../utils/respond';

const db = new Database('./db/local.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage

const RESULT_LIMIT = 3;

const search = async ({ say, text }) => {
  const args = text.split(' ');
  const learnee = args[0];
  const query = args.slice(1).join(' ');

  const { total } = db
    .prepare('SELECT count(*) as total FROM learn WHERE learnee = ? AND lower(content) = lower(?)')
    .get(learnee, query);

  let out;
  if (total > 0) {
    const hits = db
      .prepare('SELECT content FROM learn WHERE learnee = ? AND lower(content) = lower(?) ORDER BY createdDate DESC LIMIT ?')
      .all(learnee, query, RESULT_LIMIT);

    out = `Showing ${hits.length} of ${total} hit${total === 1 ? '' : 's'} for ${learnee} matching "${query}":\n${hits.map(({ content }) => `- ${content}`).join('\n')}`;
  } else {
    out = `No hits for ${learnee} matching "${query}".`;
  }

  respondUnthreaded(say, out);
};

export default search;
