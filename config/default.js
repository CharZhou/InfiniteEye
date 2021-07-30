module.exports = {
  log4j: {
    appenders: {
      STDOUT: { type: 'stdout' },
      FILE_ALL: {
        type: 'file',
        filename: 'logs/all.log',
        maxLogSize: 10485760,
        backups: 10
      },
      FILE_ERROR: {
        type: 'dateFile',
        filename: 'logs/error.log',
        daysToKeep: 30,
        keepFileExt: true
      },
      FILE_HTTP: {
        type: 'dateFile',
        filename: 'logs/http.log',
        daysToKeep: 30,
        keepFileExt: true
      }
    },
    categories: {
      default: { appenders: ['STDOUT', 'FILE_ALL'], level: 'debug' },
      error: {
        appenders: ['STDOUT', 'FILE_ERROR'],
        level: 'error'
      },
      http: {
        appenders: ['STDOUT', 'FILE_HTTP'], level: 'debug'
      }
    }
  },
  enableXRTime: true,
  enablePrintTraceOnError: true,
  mongodb: {
    uri: '',
    database_name: 'infinite_eye',
    loggerLevel: 'error',
    pool_size: 10,
    default_expire: 600,
    keep_alive: 60,
    debug: false
  },
  redis: {
    host: '',
    port: 6379,
    password: '',
    keepalive: 100
  },
  mysql: {
    host: '',
    port: 3306,
    user: 'root',
    password: '',
    database: 'infinite_eye',
    connectionLimit: 1000
  }
};
