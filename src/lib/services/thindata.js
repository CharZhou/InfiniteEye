const { getMongooseModel, StringToObjectId } = require('../utils/mongoose');
const { getDataSystemById } = require('./datasystem');
const fatDataSvc = require('./fatdata');

async function getThinDataModelById (modelId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  return ThinDataModel.findById(modelId).populate('properties');
}

async function addDataModel (modelName, belongSystemId, modelPropertyIds) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  const newThinDataModel = new ThinDataModel({
    model_name: modelName,
    belong_system: StringToObjectId(belongSystemId),
    properties: modelPropertyIds,
  });
  await newThinDataModel.save();
  return newThinDataModel;
}

async function delDataModel (modelId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  await ThinDataModel.findByIdAndDelete(modelId);
  return 1;
}

async function updateDataModel (modelId, modelInfo) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  const rawThinDataModel = await ThinDataModel.findById(modelId);
  for (const key in modelInfo) {
    rawThinDataModel.set(key, modelInfo[key]);
  }
  await rawThinDataModel.save();
  return 1;
}

async function queryFatDataModel (databaseName, dataModelRef, currentModelData) {
  const queryCondition = dataModelRef.filter_condition || {};
  if (currentModelData[dataModelRef.source_key]) {
    queryCondition[dataModelRef.target_key] = currentModelData[dataModelRef.source_key];
  }
  return fatDataSvc.queryDataModel(dataModelRef.target_model, queryCondition);
}

async function queryThinDataModel (dataModelRef, currentModelData) {
  const queryCondition = dataModelRef.filter_condition || {};
  if (currentModelData[dataModelRef.source_key]) {
    queryCondition[dataModelRef.target_key] = currentModelData[dataModelRef.source_key];
  }
  return queryDataModel(dataModelRef.target_model, queryCondition);
}

async function queryDataModel (modelId, queryCondition) {
  const thinDataEntity = await getThinDataModelById(modelId);
  const dataSystemEntity = await getDataSystemById(thinDataEntity.belong_system);
  const initModelData = {};

  for await (const property of thinDataEntity.properties) {
    if (['FatModelRef', 'ThinModelRef'].indexOf(property.type) === -1) {
      initModelData[property.key] = queryCondition[property.key] || null;
    }
  }

  // await Promise.all(thinDataEntity.properties.map(async property => {
  //   if (property.type === 'FatModelRef') {
  //     initModelData[property.key] = await queryFatDataModel(dataSystemEntity.database_name, property.ref, initModelData);
  //   }
  // }).map(async property => {
  //   if (property.type === 'ThinModelRef') {
  //     initModelData[property.key] = await queryThinDataModel(property.ref, initModelData);
  //   }
  // }));

  for await (const property of thinDataEntity.properties) {
    if (property.type === 'FatModelRef') {
      initModelData[property.key] = await queryFatDataModel(dataSystemEntity.database_name, property.ref, initModelData);
    }
  }

  for await (const property of thinDataEntity.properties) {
    if (property.type === 'ThinModelRef') {
      initModelData[property.key] = await queryThinDataModel(property.ref, initModelData);
    }
  }

  return initModelData;
}

async function addDataModelProperty (modelId, propertyId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  const thinDataModelEntity = await ThinDataModel.findById(modelId);
  thinDataModelEntity.properties.push(propertyId);
  await thinDataModelEntity.save();
  return 1;
}

async function removeDataModelProperty (modelId, propertyId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  await ThinDataModel.findByIdAndUpdate(modelId, {
    $pull: {
      properties: propertyId,
    },
  });
  return 1;
}

module.exports = {
  addDataModel,
  getThinDataModelById,
  updateDataModel,
  delDataModel,
  queryDataModel,
  addDataModelProperty,
  removeDataModelProperty,
};
