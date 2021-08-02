const { SchemaType } = require('../database/mongoose');

module.exports = {
  // 模型属性字段说明
  name: { type: SchemaType.String, require: true },
  // 模型属性字段
  key: { type: SchemaType.String, require: true },
};
