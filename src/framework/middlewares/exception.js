const { getLogger } = require('../../lib/utils/logutil');
module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    getLogger().error(err);
    ctx.type = 'json';
    ctx.response.status = err.status || 500;

    ctx.response.body = {};
    ctx.response.body.status = 'FAIL';
    ctx.response.body.errcode = err.code || 500;
    ctx.response.body.errmsg = err.message;
    ctx.response.body.timestamp = Math.round(new Date().getTime() / 100);

    if (process.env.ENABLE_TRACE_STACK) {
      ctx.response.body.stack = err.stack;
    }
  }
};
