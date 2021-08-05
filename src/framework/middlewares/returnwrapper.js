module.exports = () => async (ctx, next) => {
  ctx.state.outterBody = {};

  await next();

  if (ctx.body) {
    ctx.body = {
      status: 'SUCCESS',
      timestamp: Math.round(new Date().getTime() / 100),
      data: ctx.body,
    };

    if (ctx.state.outterBody) {
      for (const bodyKey in ctx.state.outterBody) {
        ctx.body[bodyKey] = ctx.state.outterBody[bodyKey];
      }
    }
  }
};
