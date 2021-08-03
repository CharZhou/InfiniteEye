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
      '用户所有有效的校园快递订单',
      systemId, [{
        name: '用户ID',
        key: 'id',
        type: 'ObjectId',
      }, {
        name: '订单列表',
        key: 'order_list',
        type: 'FatModelRef',
        ref: {
          target_model: '61089313c6ed113452829580',
          filter_condition: {
            status: 'DeliveryFinish',
          },
          source_key: 'id',
          target_key: 'create_id',
        },
      }]);
  });

  it('查询瘦数据业务模型', async () => {
    console.log(await thinDataSvc.getThinDataModelById('6108f5be7567f960388a2321'));
  });

  it('查询瘦数据业务数据', async () => {
    console.log(await thinDataSvc.queryDataModel('6108f5be7567f960388a2321', {
      id: '605f2a8eeaa87b6fb80f8bb0',
    }));
  });
});
