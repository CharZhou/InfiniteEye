const { getMongooseModel, StringToObjectId } = require('../utils/mongoose');
const { getDataSourceMongooseClient, SchemaType } = require('../database/mongoose');
const { getDataSystemById } = require('./datasystem');

async function getDataModelById (modelId) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  return FatDataModel.findById(modelId).populate('properties');
}

async function addModelProperty (propertyName, propertyKey, propertyType) {
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
    return addModelProperty(modelProperty.name, modelProperty.key, modelProperty.type);
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
  const newFatDataEntity = await FatDataModel.findById(modelId);
  await newFatDataEntity.del();
}

async function updateDataModel (modelId, updateCondition) {

}

async function createFatDataModel (mongooseClient, fatDataEntity) {
  const propertyTypeMapping = {
    String: SchemaType.String,
    Number: SchemaType.Number,
    ObjectId: SchemaType.ObjectId,
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
  const fatDataEntity = await getDataModelById(modelId);
  const dataSystemEntity = await getDataSystemById(fatDataEntity.belong_system);
  const mongooseClient = await getDataSourceMongooseClient(dataSystemEntity.database_name);
  await createFatDataModel(mongooseClient, fatDataEntity);
  const visibleKeys = fatDataEntity.properties.map(property => property.key);
  const model = await mongooseClient.model(fatDataEntity.model_name);
  return model.find(queryCondition, visibleKeys, queryOption);
}

module.exports = {
  addDataModel,
  getDataModelById,
  updateDataModel,
  delDataModel,
  queryDataModel,
};
