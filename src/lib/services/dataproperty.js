const { getMongooseModel } = require('../utils/mongoose');

async function getDataProperty (propertyId) {
  const DataProperty = await getMongooseModel('DataProperty');
  return DataProperty.findById(propertyId);
}

async function addDataProperty (propertyData) {
  const DataProperty = await getMongooseModel('DataProperty');
  const newDataProperty = new DataProperty({
    name: propertyData.name,
    key: propertyData.key,
    type: propertyData.type,
    ref: propertyData.ref,
  });
  await newDataProperty.save();
  return newDataProperty;
}

async function deleteDataProperty (propertyId) {
  const DataProperty = await getMongooseModel('DataProperty');
  await DataProperty.findByIdAndDelete(propertyId);
  return 1;
}

async function updateDataProperty (propertyId, propertyData) {
  const DataProperty = await getMongooseModel('DataProperty');
  const dataPropertyEntity = await DataProperty.findById(propertyId);
  for (const key in propertyData) {
    dataPropertyEntity.set(key, propertyData[key]);
  }
  await dataPropertyEntity.save();
  return 1;
}

module.exports = {
  getDataProperty,
  addDataProperty,
  deleteDataProperty,
  updateDataProperty,
};
