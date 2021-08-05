const { SchemaType } = require('../database/mongoose');

const allowedDataPropertyType = {
  String: { label: '字符串' },
  Number: { label: '数字' },
  Date: { label: '日期' },
  ObjectId: { label: '唯一ID' },
  FatModelRef: { label: '胖模型关联' },
  ThinModelRef: { label: '瘦模型关联' },
};

const dataPropertyTypeMapping = {
  String: SchemaType.String,
  Number: SchemaType.Number,
  Date: SchemaType.Date,
  ObjectId: SchemaType.ObjectId,
};

module.exports = {
  allowedDataPropertyType,
  dataPropertyTypeMapping,
};
