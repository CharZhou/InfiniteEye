const { getMongooseModel, StringToObjectId } = require('../utils/mongoose');
const { getDataSourceMongooseClient, SchemaType } = require('../database/mongoose');
const { getDataSystemById } = require('./datasystem');

async function listFatDataModel () {
  const FatDataModel = await getMongooseModel('FatDataModel');
  return FatDataModel.find();
}

async function getFatDataModelById (modelId) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  return FatDataModel.findById(modelId).populate('properties');
}

async function addDataModel (modelName, collectionName, belongSystemId, modelPropertyIds) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  const newFatDataEntity = new FatDataModel({
    model_name: modelName,
    collection_name: collectionName,
    belong_system: StringToObjectId(belongSystemId),
    properties: modelPropertyIds,
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

async function addDataModelProperty (modelId, propertyId) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  const fatDataEntity = await FatDataModel.findById(modelId);
  fatDataEntity.properties.push(propertyId);
  await fatDataEntity.save();
  return 1;
}

async function removeDataModelProperty (modelId, propertyId) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  await FatDataModel.findByIdAndUpdate(modelId, {
    $pull: {
      properties: propertyId,
    },
  });
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

module.exports = {
  listFatDataModel,
  getFatDataModelById,
  addDataModel,
  updateDataModel,
  delDataModel,
  queryDataModel,
  addDataModelProperty,
  removeDataModelProperty,
};
