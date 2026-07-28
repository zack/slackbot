const path = require('path');

module.exports = {
  apps: [{
    // Named after the directory this is cloned into, so each instance keeps
    // a stable, distinct identity across restarts without manual renaming,
    // and `pm2 restart ecosystem.config.js` reliably targets the existing
    // process instead of spawning a duplicate.
    name: path.basename(__dirname),
    namespace: 'slackbot',
    // tsx's own watcher reloads on every src change (dev-in-prod), so pm2
    // just supervises the process rather than watching files itself —
    // pm2's built-in watch has proven unreliable (silently stops watching).
    script: './node_modules/.bin/tsx',
    args: ['watch', 'src/app.ts'],
  }],
};
