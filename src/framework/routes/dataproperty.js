const KoaRouter = require('koa-router');
const dataPropertySvc = require('../../lib/services/dataproperty');
const { allowedDataPropertyType } = require('../../lib/constant/dataproperty');

const router = new KoaRouter();

router.get('/:propertyId', async (ctx) => {
  ctx.body = await dataPropertySvc.getDataProperty(ctx.request.params.propertyId);
});

router.patch('/:propertyId', async (ctx) => {
  ctx.body = await dataPropertySvc.updateDataProperty(ctx.request.params.propertyId, ctx.request.body);
});

router.del('/:propertyId', async (ctx) => {
  ctx.body = await dataPropertySvc.deleteDataProperty(ctx.request.params.propertyId);
});

router.put('/', async (ctx) => {
  ctx.body = await dataPropertySvc.addDataProperty(ctx.request.body);
});

router.get('/config/allowedTypes', async (ctx) => {
  console.log('allowedTypes');
  ctx.body = allowedDataPropertyType;
});

module.exports = {
  basePath: '/dataproperty',
  router,
};
