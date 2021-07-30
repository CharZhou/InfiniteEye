const http = require('http');
const https = require('https');
const app = require('../src/app');

http.createServer(app.callback()).listen(40078);
https.createServer(app.callback()).listen(40079);
