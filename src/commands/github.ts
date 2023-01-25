import { respondThreaded } from '../utils/respond';

const github = ({ say, body }) => {
  respondThreaded(say, body, 'https://wwww.github.com/zack/slackbot/');
};

export default github;
