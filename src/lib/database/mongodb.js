const config = require('config');
const mongoDbConfig = config.get('mongodb');
const mongoose = require('mongoose');
const { getLogger } = require('../utils/log');

let mongooseClient = null;

// DEBUG 模式
mongoose.set('debug', mongoDbConfig.debug);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

async function getMongooseClient () {
  if (mongooseClient === null) {
    mongooseClient = await mongoose.createConnection(mongoDbConfig.uri, {
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

function StringToObjectId (id) {
  return mongoose.Types.ObjectId(id);
}

module.exports = {
  Connection: mongoose.Connection,
  Error: mongoose.Error,
  Model: mongoose.Model,
  MongooseDocument: mongoose.Document,
  MongooseSchema: mongoose.Schema,
  StringToObjectId,
  getMongooseClient,
};
