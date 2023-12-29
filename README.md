A basic slackbot built on Node.

# Environment Requirements
1. npm and sqlite or mysql
1. I recommend `pm2` with the `--watch` flag and sqlite
1. There are also the necessary files to run this with Docker and MySQL

# Slack Permission and Requirements
## OAuth & Permissions > Scopes > Bot Token Scopes
1. channels:history
1. chat:write
1. emoji:read
1. files:read
1. files:write
1. groups:history
1. im:history
1. mpim:history
1. reactions:read
1. reactions:write
1. users:read

## OAuth & Permissions > Scopes > User Token Scopes
1. channels:write

## Event Subscriptions > Subscribe to bot events
1. emoji_changed
1. message.channels
1. message.groups
1. message.im
1. message.mpim
1. reaction_added

# Setup
1. Follow the instructions [here](https://slack.dev/bolt-python/tutorial/getting-started) to create and install a new app and get your secret tokens.
1. Turn on socket mode at https://app.slack.com/app-settings/SOMETHING/SOMETHING_ELSE/socket-mode
1. `$ cp .env.sample .env` and add the token you generated when you turn on socket mode to `.env` as `SOCKET_TOKEN`
1. Uncomment your desired database options in `.env`
1. Create a directory for the bot and then run `git clone` from inside this directory. The parent repo will hold the databases and some logs.
1. Inside the git repo: `$ npm ci`
1. Finish filling out `.env` with `SLACK_SIGNING_TOKEN` and `SLACK_BOT_TOKEN`.
1. You can also add the `SLACK_USER_TOKEN` if you want to use the feature for incrementing a channel name (you probably don't).
1. Grant the necessary permissions (see above) under "Scopes > Bot Token Scopes" at https://api.slack.com/apps/SOMETHING/oauth?
1. Enable and subscribe to the appropriate events (see above) at https://api.slack.com/apps/SOMETHING/event-subscriptions?
1. For development, run `$ npm start run`.
1. For production, first run `$npm run build` and then, if using pm2, run : `$ pm2 start ecosystem.config.js`
1. If you're running multiple slackbots, rename each one with `$ pm2 restart <id> -n <newname>`.
1. Your bot should now be able to respond to commands!
1. To deploy the latest version in production, send the command `?deploy`. Check what version is running with `?version`.

# APIs
You should delete the relevant lines from the `.env` file for any APIs you do not wish to use.

## Google
The command ?summon uses google image search. In order to use this commands, you'll need to follow the instructions [here](https://github.com/abhi11210646/image-search-google) and then fill in the correct keys in `.env`.

## Giphy
The command ?gif uses giphy. In order to use this commands, you'll need to create an account at giphy.com, generate an API key, and fill it in in `.env`. Additionally, you must set the desired rating in the same file.

## Openai
The commands ?aichat and ?aiart use openai. In order to use these commands, you'll need to create an account at openai.com, generate an API key, and fill it in in `.env`.

# Usage
1. Commands are run using the ?command syntax.
1. ?help for a list of commands
1. There are also some (as of now undocumented) emoji interactions. Sorry!

# Emojis you will want
1. The Slack bubble letters emoji pack
1. The emojis in the `emojis` directory. Make sure you don't change the names.
    1. I suggest using [Neutral Face Emoji Tools](https://chrome.google.com/webstore/detail/neutral-face-emoji-tools/anchoacphlfbdomdlomnbbfhcmcdmjej) for Chrome. Then you can just drag and drop them all in at once.
