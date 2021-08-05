module.exports = {
  enableMongooseDebug: true,
  enablePrintTraceOnError: true,
  log4j: {
    categories: { default: { level: 'trace' } },
  },
  mongodb: {
    loggerLevel: 'info',
    uri: 'mongodb://root:root@mongodb:27017/admin',
  },
  mysql: {
    host: 'mysql',
  },
  redis: {
    host: 'redis',
  },
  dataSource: {
    debug: true,
    loggerLevel: 'info',
    uri: 'mongodb://root:root@mongodb:27017/admin',
  },
};
