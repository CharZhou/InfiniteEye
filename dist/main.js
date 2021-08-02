const http = require('http');
const https = require('https');
const { app, loadApp } = require('../src/app');
const mysql = require('../src/lib/database/mysql');
const redis = require('../src/lib/database/redis');
const mongoose = require('../src/lib/database/mongoose');
const { getLogger } = require('../src/lib/utils/log');
const { generateAllMongooseModel } = require('../src/lib/utils/mongoose');

async function initDatabase () {
  await mysql.getMySqlConnection();
  await redis.getRedisClient();
  await mongoose.getMongooseClient();

  await generateAllMongooseModel();
  await getLogger('mongoose').info('All Mongoose Model Generate Finished');

  getLogger('database').info('Database Init Finished');
}

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

module.exports = { initDatabase };
