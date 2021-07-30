const { describe, it } = require('mocha');
const log4j = require('log4js');

describe('Log4j模块', () => {
  it('log4j配置', () => {
    log4j.configure({
      appenders: { stdout: { type: 'stdout' } },
      categories: { default: { appenders: ['stdout'], level: 'info' } }
    });
  });

  it('log4j调用', () => {
    const logger = log4j.getLogger();
    logger.trace('this is trace');
    logger.debug('this is debug');
    logger.info('this is info');
    logger.warn('this is warn');
    logger.error('this is error');
    logger.fatal('this is fatal');
  });
});
