module.exports = () => async (ctx, next) => {
  const started = Date.now();
  await next();
  const elapsed = (Date.now() - started) + 'ms';
  ctx.responseTime = elapsed;
  ctx.set('X-ResponseTime', elapsed);
};
