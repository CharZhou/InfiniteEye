const { getMongooseModel, StringToObjectId } = require('../utils/mongoose');
const { getDataSystemById } = require('./datasystem');
const fatDataSvc = require('./fatdata');
const dataPropertyConstant = require('../constant/dataproperty');
const { parseFromDataWithPath } = require('../utils/other');

async function listThinDataModel () {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  return ThinDataModel.find();
}

async function getThinDataModelById (modelId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  return ThinDataModel.findById(modelId).populate('properties');
}

async function addDataModel (modelName, belongSystemId) {
  const ThinDataModel = await getMongooseModel('ThinDataModel');
  const newThinDataModel = new ThinDataModel({
    model_name: modelName,
    belong_system: StringToObjectId(belongSystemId),
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
  const thinDataModel = await ThinDataModel.findById(modelId);
  for (const key in modelInfo) {
    thinDataModel.set(key, modelInfo[key]);
  }
  thinDataModel.update_time = Date.now();
  await thinDataModel.save();
  return 1;
}

async function filterTargetNode (data, targetNode) {
  const dataType = Object.prototype.toString.call(data);
  let filteredData = data;
  if (dataType === '[object Array]') {
    filteredData = data.map((p) => {
      const pD = {};
      pD[targetNode] = p[targetNode];
      return pD;
    });
  } else if (dataType === '[object Object]') {
    filteredData = data[targetNode];
  }
  return filteredData;
}

async function queryFatDataModel (databaseName, dataModelRef, currentModelData) {
  const queryCondition = {};
  if (currentModelData[dataModelRef.source_key]) {
    queryCondition[dataModelRef.target_key] = currentModelData[dataModelRef.source_key];
  }
  const queryOption = {};
  let fatData = await fatDataSvc.queryDataModel(dataModelRef.target_model, queryCondition, queryOption);
  if (dataModelRef.target_node) {
    fatData = filterTargetNode(fatData, dataModelRef.target_node);
  }
  return fatData;
}

async function queryThinDataModel (dataModelRef, currentModelData) {
  const queryCondition = {};
  if (currentModelData[dataModelRef.source_key]) {
    queryCondition[dataModelRef.target_key] = currentModelData[dataModelRef.source_key];
  }

  let thinData = await queryDataModel(dataModelRef.target_model, queryCondition);
  if (dataModelRef.target_node) {
    thinData = filterTargetNode(thinData, dataModelRef.target_node);
  }
  return thinData;
}

async function queryDataModel (modelId, queryCondition) {
  const thinDataEntity = await getThinDataModelById(modelId);
  const dataSystemEntity = await getDataSystemById(thinDataEntity.belong_system);
  const initModelData = {};

  for await (const property of thinDataEntity.properties) {
    if (dataPropertyConstant.thinModelAvailableDataPropertyTypeKeys().indexOf(property.type) === -1) {
      initModelData[property.key] = queryCondition[property.key] || null;
    }
  }

  for await (const property of thinDataEntity.properties) {
    if (property.type === dataPropertyConstant.FatModelRefKey) {
      initModelData[property.key] = await queryFatDataModel(dataSystemEntity.database_name, property.ref, initModelData);
    }
  }

  for await (const property of thinDataEntity.properties) {
    if (property.type === dataPropertyConstant.ThinModelRefKey) {
      initModelData[property.key] = await queryThinDataModel(property.ref, initModelData);
    }
  }

  for await (const property of thinDataEntity.properties) {
    if (property.type === dataPropertyConstant.DataTransferKey) {
      initModelData[property.key] = await transferModelData(property.transfer, initModelData);
    }
  }

  return initModelData;
}

async function transferModelData (dataModelTransfer, currentModelData) {
  const transferRule = dataModelTransfer.transfer_rule;
  const transferFunc = require(`../transfer/${transferRule}`);
  const inputData = await parseFromDataWithPath(currentModelData, dataModelTransfer.source_key.split('.'));
  return transferFunc(inputData, dataModelTransfer.transfer_param);
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
  listThinDataModel,
};
