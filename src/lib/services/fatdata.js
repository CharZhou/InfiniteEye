const { getMongooseModel, StringToObjectId } = require('../utils/mongoose');
const { getDataSourceMongooseClient, SchemaType } = require('../database/mongoose');
const { getDataSystemById } = require('./datasystem');

async function getFatDataModelById (modelId) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  return FatDataModel.findById(modelId).populate('properties');
}

async function generateModelProperty (propertyName, propertyKey, propertyType) {
  const DataProperty = await getMongooseModel('DataProperty');
  const newDataProperty = new DataProperty({
    name: propertyName,
    key: propertyKey,
    type: propertyType,
  });
  await newDataProperty.save();
  return newDataProperty;
}

async function addDataModel (modelName, collectionName, belongSystemId, modelProperties) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  const modelPropertyArray = await Promise.all(modelProperties.map(async modelProperty => {
    return generateModelProperty(modelProperty.name, modelProperty.key, modelProperty.type);
  }));
  const newFatDataEntity = new FatDataModel({
    model_name: modelName,
    collection_name: collectionName,
    belong_system: StringToObjectId(belongSystemId),
    properties: modelPropertyArray,
  });
  await newFatDataEntity.save();
  return newFatDataEntity;
}

async function delDataModel (modelId) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  await FatDataModel.findByIdAndDelete(modelId);
  return 1;
}

async function updateDataModel (modelId, modelInfo) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  const fatDataEntity = await FatDataModel.findById(modelId);
  for (const key in modelInfo) {
    fatDataEntity.set(key, modelInfo[key]);
  }
  await fatDataEntity.save();
  return 1;
}

async function createFatDataModel (mongooseClient, fatDataEntity) {
  const propertyTypeMapping = {
    String: SchemaType.String,
    Number: SchemaType.Number,
    ObjectId: SchemaType.ObjectId,
    Date: SchemaType.Date,
  };
  if (!(fatDataEntity.model_name in Object.keys(mongooseClient.models))) {
    const schema = {};
    for await (const property of fatDataEntity.properties) {
      schema[property.key] = { type: propertyTypeMapping[property.type] };
    }
    return mongooseClient.model(fatDataEntity.model_name, schema, fatDataEntity.collection_name, true);
  }
}

async function queryDataModel (modelId, queryCondition, queryOption) {
  const fatDataEntity = await getFatDataModelById(modelId);
  const dataSystemEntity = await getDataSystemById(fatDataEntity.belong_system);
  const mongooseClient = await getDataSourceMongooseClient(dataSystemEntity.database_name);
  await createFatDataModel(mongooseClient, fatDataEntity);
  const visibleKeys = fatDataEntity.properties.map(property => property.key);
  const model = await mongooseClient.model(fatDataEntity.model_name);
  return model.find(queryCondition, visibleKeys, queryOption);
}

async function addModelProperty (modelId, propertyData) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  const fatDataEntity = await FatDataModel.findById(modelId);
  const dataPropertyEntity = await generateModelProperty(propertyData.name, propertyData.key, propertyData.type);
  fatDataEntity.properties.push(dataPropertyEntity.id);
  await fatDataEntity.save();
  return 1;
}

async function updateModelProperty (modelId, propertyId, propertyData) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  const fatDataEntity = await FatDataModel.findById(modelId);
  if (fatDataEntity.properties.indexOf(propertyId) === -1) {
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
  const FatDataModel = await getMongooseModel('FatDataModel');
  const fatDataEntity = await FatDataModel.findById(modelId);
  if (fatDataEntity.properties.indexOf(propertyId) === -1) {
    return 0;
  }
  const DataProperty = await getMongooseModel('DataProperty');
  await DataProperty.findByIdAndDelete(propertyId);
  await FatDataModel.findByIdAndUpdate(modelId, {
    $pull: {
      properties: propertyId,
    },
  });
  return 1;
}

module.exports = {
  addDataModel,
  getFatDataModelById,
  updateDataModel,
  delDataModel,
  queryDataModel,
  addModelProperty,
  updateModelProperty,
  delModelProperty,
};
