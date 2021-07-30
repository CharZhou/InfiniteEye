const Koa = require('koa');
const koaLog4j = require('koa-log4');
const log4j = require('log4js');
const cors = require('@koa/cors');
const body = require('koa-body');
const routeUtil = require('./lib/utils/route');
const exceptionMiddleware = require('./framework/middlewares/exception');
const responseTimeMiddleware = require('./framework/middlewares/responsetime');
const { getLogger } = require('./lib/utils/log');

const app = new Koa();

app.use(koaLog4j.koaLogger(log4j.getLogger('http'), { level: 'auto' }));
app.use(cors());
app.use(responseTimeMiddleware());
app.use(body({
  multipart: true
}));
app.use(exceptionMiddleware());

routeUtil.loadRoutes(app).then(() => {
  getLogger('route').info('Route Load Finished');
});

// getLogger('app').info('App Load Finished');

module.exports = app;
