A basic slackbot built on Node.

# Environment Requirements
1) npm
1) I recommend `pm2` with the `--watch` flag

# Slack Permission and Requirements
## OAuth & Permissions > Scopes > Bot Token Scopes
1) channels:history
1) chat:write
1) emoji:read
1) reactions:read
1) reactions:write
1) users:read

## Event Subscriptions > Subscribe to bot events
1) message.channels
1) message.groups
1) message.im
1) message.mpim
1) reaction_added

# Setup
1) Follow the instructions [here](https://slack.dev/bolt-python/tutorial/getting-started) to create and install a new app and get your secret tokens.
1) Turn on socket mode at https://app.slack.com/app-settings/SOMETHING/SOMETHING_ELSE/socket-mode
1) `$ cp .env.sample .env` and add the token you generate when you turn on socket mode to `.env` as `SOCKET_TOKEN`
1) Create a directory for the bot and then run `git clone` from inside this directory. The parent repo will hold the databases and some logs.
1) Inside the git repo: `$ npm install`
1) Finish filling out `.env` with `SLACK_SIGNING_TOKEN` and `SLACK_BOT_TOKEN`.
1) Grant the necessary permissions (see above) under "Scopes > Bot Token Scopes" at https://api.slack.com/apps/SOMETHING/oauth?
1) Enable and subscribe to the appropriate events (see above) at https://api.slack.com/apps/SOMETHING/event-subscriptions?
1) In the parent directory: `$ lt --port 3000 --subdomain yoursubdomainhere > lt.out &`
1) Fill in the request URL as https://yoursubdomainhere.loca.lt/slack/events
1) For development, run `$ npm run start`
1) For production, first run `$npm run build` and then, if using pm2, run : `$ pm2 start built/app.js --watch`
1) Your bot should now be able to respond to commands!
1) To deploy the latest version in production, send the command `?deploy`. Check what version is running with `?version`.

# Usage
1) Commands are run using the ?command syntax.
1) ?help for a list of commands
1) There are also some (as of now undocumented) emoji interactions. Sorry!


# Emoji you will want
(TODO: Add these to the repo)
1) :learn: and :unlearn:
1) The Slack bubble letters emoji pack plus :spacer:
