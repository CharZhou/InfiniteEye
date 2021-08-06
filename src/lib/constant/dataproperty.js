const { SchemaType } = require('../database/mongoose');

const FatModel = 'FatModel';
const ThinModel = 'ThinModel';

const FatModelRefKey = 'FatModelRef';
const ThinModelRefKey = 'ThinModelRef';
const DataTransferKey = 'DataTransfer';

const allowedDataPropertyType = {
  String: { label: '字符串', availableModels: [FatModel, ThinModel] },
  Number: { label: '数字', availableModels: [FatModel, ThinModel] },
  Date: { label: '日期', availableModels: [FatModel, ThinModel] },
  ObjectId: { label: '物件ID', availableModels: [FatModel, ThinModel] },
  Boolean: { label: '布尔值', availableModels: [FatModel, ThinModel] },
  FatModelRef: { label: '胖模型关联', availableModels: [ThinModel] },
  ThinModelRef: { label: '瘦模型关联', availableModels: [ThinModel] },
  DataTransfer: { label: '数据转换', availableModels: [ThinModel] },
};

const thinModelAvailableDataPropertyTypeKeys = () => {
  return Object.keys(allowedDataPropertyType).filter((dataPropertyType) => {
    return allowedDataPropertyType[dataPropertyType].availableModels.indexOf(ThinModel) === -1;
  });
};

const dataTransferRule = {
  Sum: { label: '计算某项之和' },
  Average: { label: '计算某项平均值' },
  Len: { label: '计算数组长度' },
};

const dataPropertyTypeMapping = {
  String: SchemaType.String,
  Number: SchemaType.Number,
  Date: SchemaType.Date,
  ObjectId: SchemaType.ObjectId,
  Boolean: SchemaType.Boolean,
};

module.exports = {
  allowedDataPropertyType,
  dataPropertyTypeMapping,
  dataTransferRule,
  thinModelAvailableDataPropertyTypeKeys,
  FatModel,
  ThinModel,
  FatModelRefKey,
  ThinModelRefKey,
  DataTransferKey,
};
