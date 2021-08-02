const { getMongooseModel } = require('../utils/mongoose');

async function getDataModelById (modelId) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  return FatDataModel.findById(modelId).populate('modelProperty');
}

async function addModelProperty (propertyName, propertyKey) {
  const DataProperty = await getMongooseModel('DataProperty');
  const newDataProperty = new DataProperty({
    name: propertyName,
    key: propertyKey,
  });
  await newDataProperty.save();
  return newDataProperty;
}

async function addDataModel (modelName, collectionName, modelProperties) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  const modelPropertyArray = await Promise.all(modelProperties.map(async modelProperty => {
    return addModelProperty(modelProperty.name, modelProperty.key);
  }));
  const newFatDataEntity = new FatDataModel({
    modelName: modelName,
    modelCollectionName: collectionName,
    modelProperty: modelPropertyArray,
  });
  await newFatDataEntity.save();
  return newFatDataEntity.id;
}

async function delDataModel (modelId) {

}

async function updateDataModel (modelId, updateCondition) {

}

async function queryDataModel (modelId, queryCondition) {

}

module.exports = {
  addDataModel,
  getDataModelById,
  updateDataModel,
  delDataModel,
  queryDataModel,
};
