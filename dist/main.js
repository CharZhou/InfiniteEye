const http = require('http');
const https = require('https');
const { app, loadApp } = require('../src/app');
const { getLogger } = require('../src/lib/utils/log');
const { initDatabase } = require('./database');

async function startApp () {
  await http.createServer(app.callback()).listen(40078);
  await https.createServer(app.callback()).listen(40079);
  getLogger('app').info('App Launch Finished');
}

(async () => {
  await initDatabase();
  await loadApp();
  await startApp();
})();
