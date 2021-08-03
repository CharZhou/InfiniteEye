const KoaRouter = require('koa-router');
const thinDataSvc = require('../../lib/services/thindata');

const router = new KoaRouter();

router.get('/:modelId', async (ctx) => {
  ctx.body = await thinDataSvc.getThinDataModelById(ctx.request.params.modelId);
});

router.put('/', async (ctx) => {
  ctx.body = await thinDataSvc.addDataModel(
    ctx.request.body.name,
    ctx.request.body.systemId,
    ctx.request.body.properties,
  );
});

router.patch('/:modelId', async (ctx) => {
  await thinDataSvc.updateDataModel(ctx.request.params.modelId, ctx.request.body.updateCondition);
});

router.post('/:modelId', async (ctx) => {
  ctx.body = await thinDataSvc.queryDataModel(ctx.request.params.modelId, ctx.request.body.queryCondition);
});

router.del('/:modelId', async (ctx) => {
  await thinDataSvc.delDataModel(ctx.request.params.modelId);
});

module.exports = {
  basePath: '/thindata',
  router,
};
