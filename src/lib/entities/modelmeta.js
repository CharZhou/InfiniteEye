const { Schema, SchemaTypes } = require('./schema');

class ModelMeta extends Schema {
  PropertyModelDataTemplate () {
    return {
      modelName: { type: SchemaTypes.String, required: true, unique: true },
      create_time: { type: SchemaTypes.Date, required: true, default: new Date() },
    };
  }
}

module.exports = ModelMeta;
