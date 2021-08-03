const KoaRouter = require('koa-router');
const fatDataSvc = require('../../lib/services/fatdata');

const router = new KoaRouter();

router.get('/:modelId', async (ctx) => {
  ctx.body = await fatDataSvc.getDataModelById(ctx.request.params.modelId);
});

router.put('/', async (ctx) => {
  ctx.body = await fatDataSvc.addDataModel(
    ctx.request.body.name,
    ctx.request.body.collectionName,
    ctx.request.body.systemId,
    ctx.request.body.properties,
  );
});

router.patch('/:modelId', async (ctx) => {
  await fatDataSvc.updateDataModel(ctx.request.body);
});

router.post('/:modelId', async (ctx) => {
  ctx.body = await fatDataSvc.queryDataModel(ctx.request.params.modelId, ctx.request.body.queryCondition, ctx.request.body.queryOption);
});

router.del('/:modelId', async (ctx) => {
  await fatDataSvc.delDataModel(ctx.request.body);
});

module.exports = {
  basePath: '/fatdata',
  router,
};
