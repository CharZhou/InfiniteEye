module.exports = {
  log4j: {
    categories: { default: { level: 'trace' } }
  },
  mongodb: {
    uri: 'mongodb://root:root@mongodb:27017/admin',
    debug: true,
    loggerLevel: 'info'
  },
  redis: {
    host: 'redis'
  },
  mysql: {
    host: 'mysql'
  }
};
