const http = require('http');
const https = require('https');
const app = require('../src/app');
const { initEnv } = require('../src/lib/utils/envutil');
const { getLogger } = require('../src/lib/utils/logutil');

initEnv().then(() => {
  getLogger('env').info('Env Load Finish');
});

http.createServer(app.callback()).listen(40078);
https.createServer(app.callback()).listen(40079);
