import { respondThreaded } from '../utils/respond.js';

const pong = ({ body, say }) => {
  respondThreaded(say, body, 'pong');
};

export default pong;
