const config = require('config');
const log4j = require('log4js');

log4j.configure(config.get('log4j', 'config'));

const errorLogger = log4j.getLogger('error');

class Logger {
  constructor (category) {
    this.category = category;
    this.logger = log4j.getLogger(this.category);
  }

  trace (message, ...args) {
    this.logger.trace(message, ...args);
  }

  debug (message, ...args) {
    this.logger.debug(message, ...args);
  }

  info (message, ...args) {
    this.logger.info(message, ...args);
  }

  warn (message, ...args) {
    this.logger.warn(message, ...args);
  }

  error (message, ...args) {
    this.logger.error(message, args);
    errorLogger.error(message, args);
  }

  fatal (message, ...args) {
    this.logger.fatal(message, ...args);
    errorLogger.fatal(message, ...args);
  }
}

function getLogger (category) {
  return new Logger(category);
}

module.exports = {
  getLogger
};
