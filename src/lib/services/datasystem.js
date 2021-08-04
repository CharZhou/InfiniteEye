const { getMongooseModel } = require('../utils/mongoose');
const randomPwdJs = require('randompasswordjs');
const { getDataSourceDefaultMongooseClient } = require('../database/mongoose');

async function getDataSystemById (systemId) {
  const DataSystem = await getMongooseModel('DataSystem');
  return DataSystem.findById(systemId);
}

async function listDataSystem () {
  const DataSystem = await getMongooseModel('DataSystem');
  return DataSystem.find({});
}

async function createMongoDbUser (username, password, databaseName) {
  const mongooseClient = await getDataSourceDefaultMongooseClient();
  const mongodbClient = mongooseClient.getClient();
  const adminDb = mongodbClient.db().admin();
  await adminDb.addUser(username,
    password,
    {
      roles: [{
        role: 'dbOwner',
        db: databaseName,
      }],
    });
  return 1;
}

async function deleteMongoDbUser (username) {
  const mongooseClient = await getDataSourceDefaultMongooseClient();
  const mongodbClient = mongooseClient.getClient();
  const adminDb = mongodbClient.db().admin();
  await adminDb.removeUser(username);
  return 1;
}

async function addDataSystem (systemName, databaseName) {
  const DataSystem = await getMongooseModel('DataSystem');
  const randomUser = randomPwdJs.olustur(10);
  const randomPassword = randomPwdJs.olustur(20);

  await createMongoDbUser(randomUser, randomPassword, databaseName);

  const dataSystemEntity = new DataSystem({
    system_name: systemName,
    database_name: databaseName,
    system_user: randomUser,
    system_password: randomPassword,
  });
  await dataSystemEntity.save();

  return dataSystemEntity;
}

async function delDataSystem (systemId) {
  const dataSystemEntity = await getDataSystemById(systemId);
  if (!dataSystemEntity) {
    return 0;
  }
  const DataSystem = await getMongooseModel('DataSystem');
  await deleteMongoDbUser(dataSystemEntity.system_user);
  await DataSystem.findByIdAndDelete(dataSystemEntity.id);
  return 1;
}

module.exports = {
  getDataSystemById,
  addDataSystem,
  listDataSystem,
  delDataSystem,
};
