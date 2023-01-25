// Responds directly to the user who initiated the event in body
const respondDirectly = (app, body, out) => {
  const { user } = body.event;

  app.client.chat.postMessage({ channel: user, text: out });
};

// Will always respond into the top level of the channel of the instigating
// message, even if that message was in a thread.
const respondUnthreaded = (say, out) => {
  say(out);
};

// Will always forcibly respond inside of a thread. If the instigating message
// was unthreaded this will start a thread off of that message. If the
// instigating message was threaded it will respond in the existing thread.
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

// This will respond into a thread if the instigating message was already in a
// thread but otherwise will respond to the top level of the channel
const respond = (say, body, out) => {
  const isUnthreaded = body.event.thread_ts === undefined;

  // If we're in a direct message with the bot we don't need to thread
  if (isUnthreaded || body.event.channel_type === 'im') {
    respondUnthreaded(say, out);
  } else {
    respondThreaded(say, body, out);
  }
};

export {
  respond, respondDirectly, respondThreaded, respondUnthreaded,
};
