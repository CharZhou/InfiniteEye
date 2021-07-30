const KoaRouter = require('koa-router');
const modelSvc = require('../../lib/services/model');

const router = new KoaRouter();

router.get('/:modelId/', async (ctx) => {
  const modelMeta = await modelSvc.getModelMetaById(ctx.params.modelId);
  ctx.body = modelMeta;
});

router.put('/:modelId/', async (ctx) => {
  await modelSvc.addModelMeta(ctx.request.body);
});

router.del('/:modelId/', async (ctx) => {
  ctx.body = 'A';
});

module.exports = {
  basePath: '/model',
  router,
};
