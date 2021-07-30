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
      useNewUrlParser: true,
      poolSize: mongoDbConfig.pool_size,
      loggerLevel: mongoDbConfig.loggerLevel,
      useUnifiedTopology: true,
      keepAlive: mongoDbConfig.keep_alive,
      dbName: mongoDbConfig.database_name
    });
    getLogger('mongodb').info('Mongoose Connected');
  }
  return mongooseClient;
}

getMongooseClient();

module.exports = {
  getMongooseClient
};
