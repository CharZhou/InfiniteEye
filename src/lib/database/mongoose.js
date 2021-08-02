const config = require('config');
const mongoose = require('mongoose');
const { getLogger } = require('../utils/log');

const mongoDbConfig = config.get('mongodb');
const dataSourceMongoDbConfig = config.get('dataSource');
const enableMongooseDebug = config.get('enableMongooseDebug');

let mongooseClient = null;

const dataSourceMongooseClients = {};

// DEBUG 模式
mongoose.set('debug', enableMongooseDebug);
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
    getLogger('mongoose').info('MongoDb Connected');
  }
  return mongooseClient;
}

async function getDataSourceMongooseClient (databaseName) {
  if (!dataSourceMongooseClients[databaseName]) {
    dataSourceMongooseClients[databaseName] = await mongoose.createConnection(
      dataSourceMongoDbConfig.uri,
      {
        dbName: databaseName,
        keepAlive: dataSourceMongoDbConfig.keep_alive,
        loggerLevel: dataSourceMongoDbConfig.loggerLevel,
        poolSize: dataSourceMongoDbConfig.pool_size,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    getLogger('mongoose').info('Data Source Connected', databaseName);
  }
  return dataSourceMongooseClients[databaseName];
}

module.exports = {
  MongooseSchema: mongoose.Schema,
  SchemaType: mongoose.Schema.Types,
  getMongooseClient,
  getDataSourceMongooseClient,
};
