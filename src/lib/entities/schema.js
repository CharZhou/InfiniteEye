const { getMongooseClient, MongooseSchema, StringToObjectId } = require('../database/mongodb');

class MongoDBSchema {
  constructor () {
    // 类名
    this._className = this.constructor.name;

    // 集合名
    this._collectionName = this._ParseCollectionName();

    // mongoose 数据簇
    this._schema = new MongooseSchema(this.PropertyModelDataTemplate());

    // mongooseClient
    this._mongooseClient = getMongooseClient();

    // mongoose 模型实例
    this._model = this._mongooseClient.model(this._className, this._schema, this._collectionName, false);

    // Object.assign(this._Model.prototype, this.__proto__);
  }

  PropertyModelDataTemplate () {
    return {};
  }

  _ParseCollectionName () {
    let collectionName = this._className.replace(/([A-Z])/g, '_$1').toLowerCase();
    if (collectionName[0] === '_') {
      collectionName = collectionName.substring(1, collectionName.length);
    }
    return collectionName;
  }

  getModel () {
    return this._model;
  }

  newDoc (documentArgs = {}) {
    return new (this.getModel())(documentArgs);
  }

  getDocByCondition (query) {
    return this.getModel().findOne(query);
  }

  getDocById (id) {
    return this.getModel().findById(id);
  }

  static toObjectId (id) {
    return StringToObjectId(id);
  }
}

module.exports = {
  MongooseSchema,
  Schema: MongoDBSchema,
  SchemaTypes: MongooseSchema.Types,
  StringToObjectId,
};
