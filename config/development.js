module.exports = {
  enableMongooseDebug: true,
  enablePrintTraceOnError: true,
  log4j: {
    categories: { default: { level: 'trace' } },
  },
  mongodb: {
    loggerLevel: 'info',
    uri: 'mongodb://root:root@localhost:27017/admin',
  },
  mysql: {
    host: 'localhost',
  },
  redis: {
    host: 'localhost',
  },
  dataSource: {
    debug: true,
    loggerLevel: 'info',
    uri: 'mongodb://root:root@localhost:27017/admin',
  },
};
