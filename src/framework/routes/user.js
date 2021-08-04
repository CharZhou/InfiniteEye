const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('/login', async (ctx) => {
  ctx.body = {
    token: '1',
  };
});

router.get('/info', async (ctx) => {
  ctx.body = {
    name: 'charzhou',
    avatar: 'aa',
  };
});

router.post('/logout', async (ctx) => {
  ctx.body = 1;
});

module.exports = {
  basePath: '/user',
  router,
};
