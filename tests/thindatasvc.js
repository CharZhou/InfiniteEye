const { describe, it } = require('mocha');
const thinDataSvc = require('../src/lib/services/thindata');
const { initDatabase } = require('../dist/database');

describe('瘦数据业务测试', () => {
  const systemId = '610891b598719d2f733a3050';

  beforeEach(async () => {
    await initDatabase();
  });

  it('创建瘦数据业务模型', async () => {
    await thinDataSvc.addDataModel(
      '用户所有有效的校园订单',
      systemId, [{
        name: '用户ID',
        key: 'id',
        type: 'ObjectId',
      }, {
        name: '快递订单列表',
        key: 'express_order_list',
        type: 'ThinModelRef',
        ref: {
          target_model: '6108f5be7567f960388a2321',
          filter_condition: {
          },
          source_key: 'id',
          target_key: 'id',
        },
      },
      {
        name: '闪送订单列表',
        key: 'hyper_order_list',
        type: 'ThinModelRef',
        ref: {
          target_model: '610921cd3401d50460d2dcac',
          filter_condition: {
          },
          source_key: 'id',
          target_key: 'id',
        },
      }]);
  });

  it('查询瘦数据业务模型', async () => {
    console.log(await thinDataSvc.getThinDataModelById('6108f5be7567f960388a2321'));
  });

  it('查询瘦数据业务数据', async () => {
    console.log(await thinDataSvc.queryDataModel('610923028b3faf0494740a74', {
      id: '605f2a8eeaa87b6fb80f8bb0',
    }));
  });
});
