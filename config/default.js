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
        type: 'datefile',
        filename: 'logs/error.log',
        daysToKeep: 30,
        keepFileExt: true
      },
      FILE_HTTP: {
        type: 'datefile',
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
  }
};
