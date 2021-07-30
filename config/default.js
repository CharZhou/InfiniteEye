module.exports = {
  enablePrintTraceOnError: true,
  enableXRTime: true,
  log4j: {
    appenders: {
      FILE_ALL: {
        backups: 10,
        filename: 'logs/all.log',
        maxLogSize: 10485760,
        type: 'file',
      },
      FILE_ERROR: {
        daysToKeep: 30,
        filename: 'logs/error.log',
        keepFileExt: true,
        type: 'dateFile',
      },
      FILE_HTTP: {
        daysToKeep: 30,
        filename: 'logs/http.log',
        keepFileExt: true,
        type: 'dateFile',
      },
      STDOUT: { type: 'stdout' },
    },
    categories: {
      default: { appenders: ['STDOUT', 'FILE_ALL'], level: 'debug' },
      error: {
        appenders: ['STDOUT', 'FILE_ERROR'],
        level: 'error',
      },
      http: {
        appenders: ['STDOUT', 'FILE_HTTP'], level: 'debug',
      },
    },
  },
  mongodb: {
    database_name: 'infinite_eye',
    debug: false,
    default_expire: 600,
    keep_alive: 60,
    loggerLevel: 'error',
    pool_size: 10,
    uri: '',
  },
  mysql: {
    connectionLimit: 1000,
    database: 'infinite_eye',
    host: '',
    password: '',
    port: 3306,
    user: 'root',
  },
  redis: {
    host: '',
    keepalive: 100,
    password: '',
    port: 6379,
  },
};
