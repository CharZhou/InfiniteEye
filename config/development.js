module.exports = {
  log4j: {
    categories: { default: { level: 'trace' } }
  },
  mongodb: {
    uri: 'mongodb://root:root@localhost:27017/admin',
    debug: true,
    loggerLevel: 'info'
  },
  redis: {
    host: 'localhost'
  },
  mysql: {
    host: 'localhost'
  }
};
