const config = require('config');
const mongoDbConfig = config.get('mongodb');
const mongodb = require('mongoose');
const { getLogger } = require('../utils/log');

let mongooseClient = null;

// DEBUG 模式
mongodb.set('debug', mongoDbConfig.debug);
mongodb.set('useFindAndModify', false);
mongodb.set('useCreateIndex', true);

async function getMongooseClient () {
  if (mongooseClient === null) {
    mongooseClient = await mongodb.createConnection(mongoDbConfig.uri, {
      dbName: mongoDbConfig.database_name,
      keepAlive: mongoDbConfig.keep_alive,
      loggerLevel: mongoDbConfig.loggerLevel,
      poolSize: mongoDbConfig.pool_size,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    getLogger('mongodb').info('Mongoose Connected');
  }
  return mongooseClient;
}

module.exports = {
  getMongooseClient,
};
