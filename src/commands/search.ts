import Database from 'better-sqlite3';

import { respondUnthreaded } from '../utils/respond';

const db = new Database('./db/local.db');
db.pragma('journal_mode = WAL'); // https://github.com/WiseLibs/better-sqlite3#usage

const RESULT_LIMIT = 3;

// % and _ are LIKE wildcards; escape them so a literal search for e.g.
// "50%" doesn't match anything starting with "50".
const escapeLike = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

const search = async ({ say, text }) => {
  const args = text.split(' ');
  const learnee = args[0];
  const query = args.slice(1).join(' ');
  const likeQuery = `%${escapeLike(query)}%`;

  const { total } = db
    .prepare("SELECT count(*) as total FROM learn WHERE learnee = ? AND lower(content) LIKE lower(?) ESCAPE '\\'")
    .get(learnee, likeQuery);

  let out;
  if (total > 0) {
    const hits = db
      .prepare("SELECT content FROM learn WHERE learnee = ? AND lower(content) LIKE lower(?) ESCAPE '\\' ORDER BY createdDate DESC LIMIT ?")
      .all(learnee, likeQuery, RESULT_LIMIT);

    out = `Showing ${hits.length} of ${total} hit${total === 1 ? '' : 's'} for ${learnee} matching "${query}":\n${hits.map(({ content }) => `- ${content}`).join('\n')}`;
  } else {
    out = `No hits for ${learnee} matching "${query}".`;
  }

  respondUnthreaded(say, out);
};

export default search;
