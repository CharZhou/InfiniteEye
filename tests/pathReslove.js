const { describe, it } = require('mocha');
const { parseFromDataWithPath } = require('../src/lib/utils/other');

describe('解析测试', () => {
  it('字典解析测试', async () => {
    console.log(await parseFromDataWithPath({
      a: {
        b: '3231',
        ar: [{
          t: 'a', a: 'b',
        }, {
          t: 'c', a: 'd',
        }],
      },
    }, 'a.ar.$.a'.split('.')));
  });
});
