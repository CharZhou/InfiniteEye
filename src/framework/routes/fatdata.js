const KoaRouter = require('koa-router');
const fatDataSvc = require('../../lib/services/fatdata');

const router = new KoaRouter();

router.get('/:modelId', async (ctx) => {
  ctx.body = await fatDataSvc.getFatDataModelById(ctx.request.params.modelId);
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
  await fatDataSvc.updateDataModel(ctx.request.params.modelId, ctx.request.body);
});

router.post('/:modelId', async (ctx) => {
  ctx.body = await fatDataSvc.queryDataModel(ctx.request.params.modelId, ctx.request.body.queryCondition, ctx.request.body.queryOption);
});

router.post('/:modelId/:propertyId', async (ctx) => {
  ctx.body = await fatDataSvc.updateModelProperty(ctx.request.params.modelId, ctx.request.params.propertyId, ctx.request.body);
});

router.put('/:modelId/property', async (ctx) => {
  ctx.body = await fatDataSvc.addModelProperty(ctx.request.params.modelId, ctx.request.body);
});

router.del('/:modelId/:propertyId', async (ctx) => {
  ctx.body = await fatDataSvc.delModelProperty(ctx.request.params.modelId, ctx.request.request.params.propertyId);
});

router.del('/:modelId', async (ctx) => {
  await fatDataSvc.delDataModel(ctx.request.params.modelId);
});

module.exports = {
  basePath: '/fatdata',
  router,
};
