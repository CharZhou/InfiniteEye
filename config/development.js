module.exports = {
  log4j: {
    categories: { default: { level: 'trace' } },
  },
  mongodb: {
    debug: true,
    loggerLevel: 'info',
    uri: 'mongodb://root:root@localhost:27017/admin',
  },
  mysql: {
    host: 'localhost',
  },
  redis: {
    host: 'localhost',
  },
};
