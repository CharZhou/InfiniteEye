const config = require('config');
const log4j = require('log4js');

log4j.configure(config.get('log4j', 'config'));

const errorLogger = log4j.getLogger('error');

class Logger {
  constructor (category) {
    this.category = category;
    this.logger = log4j.getLogger(this.category);
  }

  trace (message) {
    this.logger.trace(message);
  }

  debug (message) {
    this.logger.debug(message);
  }

  info (message) {
    this.logger.info(message);
  }

  warn (message) {
    this.logger.warn(message);
  }

  error (message) {
    this.logger.error(message);
    errorLogger.error(message);
  }

  fatal (message) {
    this.logger.fatal(message);
    errorLogger.fatal(message);
  }
}

function getLogger (category) {
  return new Logger(category);
}

module.exports = {
  getLogger
};
