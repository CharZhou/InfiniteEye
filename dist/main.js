const http = require('http');
const https = require('https');
const app = require('../src/app');
const mysql = require('../src/lib/database/mysql');
const redis = require('../src/lib/database/redis');
const mongoose = require('../src/lib/database/mongodb');
const { getLogger } = require('../src/lib/utils/log');

(async () => {
  await mysql.getMySqlConnection();
  await redis.getRedisClient();
  await mongoose.getMongooseClient();

  await http.createServer(app.callback()).listen(40078);
  await https.createServer(app.callback()).listen(40079);

  getLogger('main').info('Service Started');
})();
