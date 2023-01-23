const respondUnthreaded = (say, out) => {
  say(out);
};

const respondThreaded = (say, body, out) => {
  const { event } = body;

  // If we're in a direct message with the bot we don't need to thread
  if (event.channel_type === 'im') {
    say(out);
    return;
  }

  const threadTs = event.thread_ts
    || event.ts
    || event.item?.ts;

  say({ text: out, thread_ts: threadTs });
};

const respond = (say, body, out) => {
  const isUnthreaded = body.event.thread_ts === undefined;

  // If we're in a direct message with the bot we don't need to thread
  if (isUnthreaded || body.event.channel_type === 'im') {
    respondUnthreaded(say, out);
  } else {
    respondThreaded(say, body, out);
  }
};

export { respond, respondUnthreaded, respondThreaded };
