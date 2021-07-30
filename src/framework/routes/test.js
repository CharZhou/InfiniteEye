const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/test', async (ctx) => {
  ctx.body = 'A';
});

router.get('/error', async (ctx) => {
  throw new Error('a');
});

module.exports = {
  basePath: '/test',
  router,
};
