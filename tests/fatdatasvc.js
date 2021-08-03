const { describe, it } = require('mocha');
const fatDataSvc = require('../src/lib/services/fatdata');
const { initDatabase } = require('../dist/database');

describe('胖数据业务测试', () => {
  let newDataModelId = '61092115cb4d29043c62f380';
  const systemId = '610891b598719d2f733a3050';

  beforeEach(async () => {
    await initDatabase();
  });

  it('创建胖数据业务模型', async () => {
    const dataModel = await fatDataSvc.addDataModel(
      '校园闪送',
      'hyper_order',
      systemId, [{
        name: '订单状态',
        key: 'status',
        type: 'String',
      }, {
        name: '下单时间',
        key: 'create_time',
        type: 'Date',
      }, {
        name: '下单用户ID',
        key: 'user_id',
        type: 'ObjectId',
      }]);

    newDataModelId = dataModel.id;
  });

  it('查询胖数据业务模型', async () => {
    await fatDataSvc.getFatDataModelById(newDataModelId);
  });

  it('查询胖数据业务数据', async () => {
    console.log(await fatDataSvc.queryDataModel(newDataModelId, {
      user_id: '605f2a8eeaa87b6fb80f8bb0',
    }, {}));
  });
});
