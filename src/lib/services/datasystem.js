const { getMongooseModel } = require('../utils/mongoose');
const randomPwdJs = require('randompasswordjs');
const { getDataSourceDefaultMongooseClient } = require('../database/mongoose');

async function getDataSystemById (systemId) {
  const DataSystem = await getMongooseModel('DataSystem');
  return DataSystem.findById(systemId);
}

async function createUser (username, password, roles) {
  const mongooseClient = await getDataSourceDefaultMongooseClient();
  const mongodbClient = mongooseClient.getClient();
  const adminDb = mongodbClient.db().admin();
  await adminDb.addUser(username,
    password,
    {
      roles: roles,
    });
}

async function addDataSystem (systemName, databaseName) {
  const DataSystem = await getMongooseModel('DataSystem');
  const dataSystemEntity = new DataSystem({
    system_name: systemName,
    database_name: databaseName,
    system_user: randomPwdJs.olustur(10),
    system_password: randomPwdJs.olustur(20),
  });
  await dataSystemEntity.save();
  await createUser(dataSystemEntity.system_user, dataSystemEntity.system_password, [{
    role: 'dbOwner',
    db: databaseName,
  }]);
  return dataSystemEntity;
}

module.exports = {
  getDataSystemById,
  addDataSystem,
};
