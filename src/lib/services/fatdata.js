const { getMongooseModel, StringToObjectId } = require('../utils/mongoose');
const { getDataSourceMongooseClient, SchemaType } = require('../database/mongoose');
const { getDataSystemById } = require('./datasystem');

async function getDataModelById (modelId) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  return FatDataModel.findById(modelId).populate('properties');
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

async function addDataModel (modelName, collectionName, belongSystemId, modelProperties) {
  const FatDataModel = await getMongooseModel('FatDataModel');
  const modelPropertyArray = await Promise.all(modelProperties.map(async modelProperty => {
    return addModelProperty(modelProperty.name, modelProperty.key);
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

async function queryDataModel (modelId, queryCondition, queryOptions) {
  const fatDataEntity = await getDataModelById(modelId);
  const dataSystemEntity = await getDataSystemById(fatDataEntity.belong_system);
  const mongooseClient = await getDataSourceMongooseClient(dataSystemEntity.database_name);
  const schema = {};
  for await (const property of fatDataEntity.properties) {
    schema[property.key] = { type: SchemaType.String };
  }
  if (!(fatDataEntity.collection_name in Object.keys(mongooseClient.models))) {
    await mongooseClient.model(fatDataEntity.collection_name, schema, fatDataEntity.collection_name, true);
  }
  const model = await mongooseClient.model(fatDataEntity.collection_name);
  return model.find(queryCondition, queryOptions);
}

module.exports = {
  addDataModel,
  getDataModelById,
  updateDataModel,
  delDataModel,
  queryDataModel,
};
