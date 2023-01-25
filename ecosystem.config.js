module.exports = {
  apps: [{
    ignore_watch: ['./src'],
    namespace: 'slackbot',
    script: './built/app.js',
    watch: ['./built'],
  }],
};
