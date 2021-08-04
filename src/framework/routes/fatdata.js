const KoaRouter = require('koa-router');
const fatDataSvc = require('../../lib/services/fatdata');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  ctx.body = await fatDataSvc.listFatDataModel();
});

router.get('/:modelId', async (ctx) => {
  ctx.body = await fatDataSvc.getFatDataModelById(ctx.request.params.modelId);
});

router.put('/', async (ctx) => {
  ctx.body = await fatDataSvc.addDataModel(
    ctx.request.body.name,
    ctx.request.body.collectionName,
    ctx.request.body.systemId,
    ctx.request.body.propertyIds,
  );
});

router.patch('/:modelId', async (ctx) => {
  ctx.body = await fatDataSvc.updateDataModel(ctx.request.params.modelId, ctx.request.body);
});

router.post('/:modelId', async (ctx) => {
  ctx.body = await fatDataSvc.queryDataModel(ctx.request.params.modelId, ctx.request.body.queryCondition, ctx.request.body.queryOption);
});

router.del('/:modelId', async (ctx) => {
  await fatDataSvc.delDataModel(ctx.request.params.modelId);
});

router.put('/:modelId/property', async (ctx) => {
  await fatDataSvc.addDataModelProperty(ctx.request.params.modelId, ctx.request.body.propertyId);
});

router.del('/:modelId/:propertyId', async (ctx) => {
  await fatDataSvc.removeDataModelProperty(ctx.request.params.modelId, ctx.request.params.propertyId);
});

module.exports = {
  basePath: '/fatdata',
  router,
};
