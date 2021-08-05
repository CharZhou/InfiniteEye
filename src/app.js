const Koa = require('koa');
const koaLog4j = require('koa-log4');
const log4j = require('log4js');
const config = require('config');
const cors = require('@koa/cors');
const body = require('koa-body');
const routeUtil = require('./lib/utils/route');
const exceptionMiddleware = require('./framework/middlewares/exception');
const paginationMiddleware = require('./framework/middlewares/pagination');
const returnWrapperMiddleware = require('./framework/middlewares/returnwrapper');

const responseTimeMiddleware = require('./framework/middlewares/responsetime');
const { getLogger } = require('./lib/utils/log');

const app = new Koa({
  proxy: config.get('trustProxy'),
});

async function loadApp () {
  app.use(koaLog4j.koaLogger(log4j.getLogger('http'), { level: 'auto' }));
  app.use(responseTimeMiddleware());
  app.use(cors());
  app.use(body({
    multipart: true,
  }));
  app.use(exceptionMiddleware());
  app.use(returnWrapperMiddleware());
  app.use(paginationMiddleware());

  await routeUtil.loadRoutes(app);
  getLogger('route').info('Route Load Finished');
}

module.exports = { app, loadApp };
