const { describe, it } = require('mocha');
const fatDataSvc = require('../src/lib/services/fatdata');
const { initDatabase } = require('../dist/main');

describe('胖数据业务测试', () => {
  beforeEach(async () => {
    await initDatabase();
  });

  it('查询胖数据业务模型', async () => {
    await fatDataSvc.getDataModelById('610754ba16f0d19042c4053b');
  });

  it('创建胖数据业务模型', async () => {
    await fatDataSvc.addDataModel('用户信息', 'users', [{
      name: '用户id',
      key: 'id',
    }, {
      name: '用户名称',
      key: 'name',
    }, {
      name: '用户密码',
      key: 'password',
    }]);
  });
});
