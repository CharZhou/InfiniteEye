const mysql = require('../src/lib/database/mysql');
const redis = require('../src/lib/database/redis');
const mongoose = require('../src/lib/database/mongoose');
const { generateAllMongooseModel } = require('../src/lib/utils/mongoose');
const { getLogger } = require('../src/lib/utils/log');

async function initDatabase () {
  await mysql.getMySqlConnection();
  await redis.getRedisClient();
  await mongoose.getMongooseClient();

  await generateAllMongooseModel();
  await getLogger('mongoose').info('All Mongoose Model Generate Finished');

  getLogger('database').info('Database Init Finished');
}

module.exports = { initDatabase };
