const KoaRouter = require('koa-router');
const { getMongooseModel } = require('../../lib/utils/mongoose');

const router = new KoaRouter();

router.get('/test', async (ctx) => {
  ctx.body = 'A';
});

router.get('/b', async (ctx) => {
  const FatDataModelModel = await getMongooseModel('FatDataModel');
  const DataPropertyModel = await getMongooseModel('DataProperty');
  const dataPropertyEntity1 = new DataPropertyModel({
    name: 'AAA',
    key: 'AAA',
  });
  await dataPropertyEntity1.save();
  const dataPropertyEntity2 = new DataPropertyModel({
    name: 'BBB',
    key: 'BBB',
  });
  await dataPropertyEntity2.save();
  const fatDataModelEntity = new FatDataModelModel({
    modelName: '测试实数据模型',
    modelProperty: [
      dataPropertyEntity1,
      dataPropertyEntity2,
    ],
  });
  await fatDataModelEntity.save();
});

router.get('/c', async (ctx) => {
  const FatDataModelModel = await getMongooseModel('FatDataModel');
  const fatDataModelEntity = await FatDataModelModel.findById('610754ba16f0d19042c4053b').populate('modelProperty');
  ctx.body = fatDataModelEntity.modelProperty[0].name;
});

router.get('/error', async (ctx) => {
  throw new Error('a');
});

module.exports = {
  basePath: '/test',
  router,
};
