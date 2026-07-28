const path = require('path');

module.exports = {
  apps: [{
    // Named after the directory this is cloned into, so each instance keeps
    // a stable, distinct identity across restarts without manual renaming,
    // and `pm2 restart ecosystem.config.js` reliably targets the existing
    // process instead of spawning a duplicate.
    name: path.basename(__dirname),
    ignore_watch: ['./src'],
    namespace: 'slackbot',
    script: './built/app.js',
    watch: ['./built'],
    watch_delay: 3000,
  }],
};
