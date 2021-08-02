const { describe, it } = require('mocha');
const { initDatabase } = require('../dist/database');
// const fatDataSvc = require('../src/lib/services/fatdata');
const dataSystemSvc = require('../src/lib/services/datasystem');

describe('数据系统业务测试', () => {
  beforeEach(async () => {
    await initDatabase();
  });

  let dataSystemId;

  it('添加数据系统', async () => {
    const dataSystemEntity = await dataSystemSvc.addDataSystem('测试系统', 'test_data1');
    dataSystemId = dataSystemEntity.id;
  });

  it('查询数据系统', async () => {
    console.log(await dataSystemSvc.getDataSystemById(dataSystemId));
  });
});
