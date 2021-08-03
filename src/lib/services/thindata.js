const { getMongooseModel, StringToObjectId } = require('../utils/mongoose');
const { getDataSystemById } = require('./datasystem');
const fatDataSvc = require('./fatdata');

async function getThinDataModelById (modelId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  return ThinDataModel.findById(modelId).populate('properties');
}

async function generateModelProperty (propertyName, propertyKey, propertyType, propertyRef) {
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
    return generateModelProperty(modelProperty.name, modelProperty.key, modelProperty.type, modelProperty.ref);
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

async function addModelProperty (modelId, propertyData) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  const thinDataEntity = await ThinDataModel.findById(modelId);
  const dataPropertyEntity = await generateModelProperty(propertyData.name, propertyData.key, propertyData.type);
  thinDataEntity.properties.push(dataPropertyEntity.id);
  await thinDataEntity.save();
  return 1;
}

async function updateModelProperty (modelId, propertyId, propertyData) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  const thinDataModel = await ThinDataModel.findById(modelId);
  if (thinDataModel.properties.indexOf(propertyId) === -1) {
    return 0;
  }
  const DataProperty = await getMongooseModel('DataProperty');
  const dataPropertyEntity = await DataProperty.findById(propertyId);
  for (const key in propertyData) {
    dataPropertyEntity.set(key, propertyData[key]);
  }
  await dataPropertyEntity.save();
  return 1;
}

async function delModelProperty (modelId, propertyId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  const thinDataModel = await ThinDataModel.findById(modelId);
  if (thinDataModel.properties.indexOf(propertyId) === -1) {
    return 0;
  }
  const DataProperty = await getMongooseModel('DataProperty');
  await DataProperty.findByIdAndDelete(propertyId);
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
  addModelProperty,
  updateModelProperty,
  delModelProperty,
};
