A basic slackbot built on Node.

# Environment Requirements
1. npm and sqlite
1. I recommend `pm2` with the `--watch` flag and sqlite

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
1. Create a directory for the bot and then run `git clone` from inside this directory. The parent repo will hold the databases and some logs. The bot uses sqlite automatically (via `better-sqlite3`), storing its database at `./db/local.db` — no configuration needed.
1. Inside the git repo: `$ npm ci`
1. Finish filling out `.env` with `SLACK_SIGNING_SECRET` and `SLACK_BOT_TOKEN`.
1. You can also add the `SLACK_USER_TOKEN` if you want to use the feature for incrementing a channel name (you probably don't).
1. Grant the necessary permissions (see above) under "Scopes > Bot Token Scopes" at https://api.slack.com/apps/SOMETHING/oauth?
1. Enable and subscribe to the appropriate events (see above) at https://api.slack.com/apps/SOMETHING/event-subscriptions?
1. For development, run `$ npm start`.
1. For production, first run `$npm run build` and then, if using pm2, run : `$ pm2 start ecosystem.config.js`
1. If you're running multiple slackbots, rename each one with `$ pm2 restart <id> -n <newname>`.
1. Your bot should now be able to respond to commands!
1. To deploy the latest version in production, send the command `?release` (`?deploy` is an alias for the same command). Check what version is running with `?version`.
1. To automatically run `?deploy` every morning (picking up any commits merged to `main` since the last release, e.g. auto-merged Dependabot PRs), set `AUTO_RELEASE_CHANNEL_ID` in `.env` to the channel you want it posted in. Optionally override the time with `AUTO_RELEASE_CRON` (a cron expression, default `0 8 * * *`) and `AUTO_RELEASE_TZ` (an IANA timezone, default `America/New_York`). Leave `AUTO_RELEASE_CHANNEL_ID` unset to disable this.

# APIs
You should delete the relevant lines from the `.env` file for any APIs you do not wish to use.

## Google
The command ?summon uses the Google Custom Search JSON API to find images. You'll need to set up a Programmable Search Engine and a Google API key, then fill in `SEARCH_ENGINE_ID` and `GOOGLE_SEARCH_API_KEY` in `.env`.

## Giphy
The command ?gif uses giphy. In order to use this commands, you'll need to create an account at giphy.com, generate an API key, and fill it in in `.env`. Additionally, you must set the desired rating in the same file.

## Openai
The commands ?aichat and ?aiimage use openai. In order to use these commands, you'll need to create an account at openai.com, generate an API key, and fill it in in `.env`.

## NASA
The commands ?apod and ?curiosity use NASA's open APIs. Generate an API key at [api.nasa.gov](https://api.nasa.gov/) and fill it in as `NASA_API_KEY` in `.env`.

## Finnhub
The command ?stock uses Finnhub for stock quotes. Create an account at finnhub.io, generate an API key, and fill it in as `FINNHUB_API_KEY` in `.env`.

# Usage
1. Commands are run using the ?command syntax.
1. ?help for a list of commands
1. There are also emoji-reaction interactions: react to a message with `aiimage`, `delete-this`, `flex-plus`/`heavy_plus_sign`, `gotem`, `learn`/`learn-intensifies`, or `unlearn` to trigger the corresponding behavior.

# Emojis you will want
1. The Slack bubble letters emoji pack
1. The emojis in the `emojis` directory. Make sure you don't change the names.
    1. I suggest using [Neutral Face Emoji Tools](https://chrome.google.com/webstore/detail/neutral-face-emoji-tools/anchoacphlfbdomdlomnbbfhcmcdmjej) for Chrome. Then you can just drag and drop them all in at once.
