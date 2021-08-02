const KoaRouter = require('koa-router');
const fatDataSvc = require('../../lib/services/fatdata');

const router = new KoaRouter();

router.get('/:modelId', async (ctx) => {
  ctx.body = await fatDataSvc.getDataModelById(ctx.request.params.modelId);
});

router.put('/:modelId', async (ctx) => {
  await fatDataSvc.addDataModel(ctx.request.body);
});

router.patch('/:modelId', async (ctx) => {
  await fatDataSvc.updateDataModel(ctx.request.body);
});

router.post('/:modelId', async (ctx) => {
  await fatDataSvc.queryDataModel(ctx.request.body);
});

router.del('/:modelId', async (ctx) => {
  await fatDataSvc.delDataModel(ctx.request.body);
});

module.exports = {
  basePath: '/fatdata',
  router,
};
