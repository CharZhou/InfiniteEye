const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { getMongooseClient } = require('../database/mongoose');
const { getLogger } = require('./log');

async function generateAllMongooseModel () {
  const mongooseClient = await getMongooseClient();
  const modelNameList = Object.keys(mongooseClient.models);
  async function loadSchema (schemaJsPath, schemaFileName) {
    const schemaName = schemaFileName.substring(0, schemaFileName.lastIndexOf('.'));
    if (modelNameList.indexOf(schemaName) !== -1) {
      return;
    }
    const schema = require(schemaJsPath + '/' + schemaFileName);
    await mongooseClient.model(schemaName, schema.schema);
    getLogger('mongoose').debug('register model', schemaName);
  }

  async function listDir (baseDir) {
    const fileList = fs.readdirSync(baseDir, 'utf-8');

    for await (const filename of fileList) {
      const stat = fs.lstatSync(`${baseDir}/${filename}`);
      if (!stat.isDirectory()) {
        await loadSchema(`${baseDir}`, `${filename}`);
      }
    }
  }

  await listDir(path.join(__dirname, '../premodels/'));
}

function StringToObjectId (id) {
  return mongoose.Types.ObjectId(id);
}

async function getMongooseModel (modelName) {
  const mongooseClient = await getMongooseClient();
  return mongooseClient.model(modelName);
}

module.exports = {
  generateAllMongooseModel,
  StringToObjectId,
  getMongooseModel,
};
