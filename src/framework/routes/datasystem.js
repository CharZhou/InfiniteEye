const KoaRouter = require('koa-router');
const dataSystemSvc = require('../../lib/services/datasystem');
const fatDataSvc = require('../../lib/services/fatdata');

const router = new KoaRouter();

router.get('/:systemId', async (ctx) => {
  ctx.body = await dataSystemSvc.getDataSystemById(ctx.request.params.systemId);
});

router.get('/', async (ctx) => {
  ctx.body = await dataSystemSvc.listDataSystem();
});

router.put('/', async (ctx) => {
  ctx.body = await dataSystemSvc.addDataSystem(ctx.request.body.systemName, ctx.request.body.databaseName);
});

router.del('/:systemId', async (ctx) => {
  ctx.body = await dataSystemSvc.delDataSystem(ctx.request.params.systemId);
});

module.exports = {
  basePath: '/datasystem',
  router,
};
