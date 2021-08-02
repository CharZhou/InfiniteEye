const { describe, it } = require('mocha');
const fatDataSvc = require('../src/lib/services/fatdata');
const { initDatabase } = require('../dist/database');

describe('胖数据业务测试', () => {
  let newDataModelId = null;
  const systemId = '6107dbd2f173f105f49e4e4d';

  beforeEach(async () => {
    await initDatabase();
  });

  it('创建胖数据业务模型', async () => {
    const dataModel = await fatDataSvc.addDataModel(
      '用户信息',
      'users',
      systemId, [{
        name: '用户id',
        key: 'id',
      }, {
        name: '用户名称',
        key: 'name',
      }, {
        name: '用户密码',
        key: 'password',
      }]);

    newDataModelId = dataModel.id;
  });

  it('查询胖数据业务模型', async () => {
    await fatDataSvc.getDataModelById(newDataModelId);
  });
});
