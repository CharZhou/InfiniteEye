const { getMongooseModel, StringToObjectId } = require('../utils/mongoose');
const { getDataSystemById } = require('./datasystem');
const fatDataSvc = require('./fatdata');

async function getThinDataModelById (modelId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  return ThinDataModel.findById(modelId).populate('properties');
}

async function addModelProperty (propertyName, propertyKey, propertyType, propertyRef) {
  const DataProperty = await getMongooseModel('DataProperty');
  const dataProperties = {
    name: propertyName,
    key: propertyKey,
    type: propertyType,
  };
  if (propertyRef) {
    dataProperties.ref = propertyRef;
  }
  const newDataProperty = new DataProperty(dataProperties);
  await newDataProperty.save();
  return newDataProperty;
}

async function addDataModel (modelName, belongSystemId, modelProperties) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  const modelPropertyArray = await Promise.all(modelProperties.map(async modelProperty => {
    return addModelProperty(modelProperty.name, modelProperty.key, modelProperty.type, modelProperty.ref);
  }));
  const newThinDataModel = new ThinDataModel({
    model_name: modelName,
    belong_system: StringToObjectId(belongSystemId),
    properties: modelPropertyArray,
  });
  await newThinDataModel.save();
  return newThinDataModel;
}

async function delDataModel (modelId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  await ThinDataModel.findByIdAndDelete(modelId);
  return 1;
}

async function updateDataModel (modelId, updateCondition) {
  return 1;
}

async function queryFatDataModel (databaseName, dataModelRef, currentModelData) {
  const queryCondition = dataModelRef.filter_condition;
  if (currentModelData[dataModelRef.source_key]) {
    queryCondition[dataModelRef.target_key] = currentModelData[dataModelRef.source_key];
  }
  return fatDataSvc.queryDataModel(dataModelRef.target_model, queryCondition, {});
}

async function queryDataModel (modelId, queryCondition) {
  const thinDataEntity = await getThinDataModelById(modelId);
  const dataSystemEntity = await getDataSystemById(thinDataEntity.belong_system);
  const initModelData = {};

  for await (const property of thinDataEntity.properties) {
    if (property.type !== 'FatModelRef') {
      initModelData[property.key] = queryCondition[property.key] || null;
    }
  }

  for await (const property of thinDataEntity.properties) {
    if (property.type === 'FatModelRef') {
      initModelData[property.key] = await queryFatDataModel(dataSystemEntity.database_name, property.ref, initModelData);
    }
  }

  return initModelData;
}

module.exports = {
  addDataModel,
  getThinDataModelById,
  updateDataModel,
  delDataModel,
  queryDataModel,
};
