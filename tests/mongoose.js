const { describe, it } = require('mocha');
const { getDataSourceMongooseClient } = require('../src/lib/database/mongoose');

describe('Mongoose数据源测试', () => {
  it('连接数据源测试', async () => {
    const mongooseClient = await getDataSourceMongooseClient('test_data');
  });
});
