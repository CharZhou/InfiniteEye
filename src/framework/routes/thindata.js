const KoaRouter = require('koa-router');
const thinDataSvc = require('../../lib/services/thindata');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  ctx.body = await thinDataSvc.listThinDataModel();
});

router.get('/:modelId', async (ctx) => {
  ctx.body = await thinDataSvc.getThinDataModelById(ctx.request.params.modelId);
});

router.put('/', async (ctx) => {
  ctx.body = await thinDataSvc.addDataModel(
    ctx.request.body.name,
    ctx.request.body.systemId,
    ctx.request.body.propertyIds,
  );
});

router.patch('/:modelId', async (ctx) => {
  ctx.body = await thinDataSvc.updateDataModel(ctx.request.params.modelId, ctx.request.body);
});

router.post('/:modelId', async (ctx) => {
  ctx.body = await thinDataSvc.queryDataModel(ctx.request.params.modelId, ctx.request.body.queryCondition);
});

router.del('/:modelId', async (ctx) => {
  ctx.body = await thinDataSvc.delDataModel(ctx.request.params.modelId);
});

router.put('/:modelId/property', async (ctx) => {
  ctx.body = await thinDataSvc.addDataModelProperty(ctx.request.params.modelId, ctx.request.body.propertyId);
});

router.del('/:modelId/:propertyId', async (ctx) => {
  ctx.body = await thinDataSvc.removeDataModelProperty(ctx.request.params.modelId, ctx.request.params.propertyId);
});

module.exports = {
  basePath: '/thindata',
  router,
};
