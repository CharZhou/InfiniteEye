const { SchemaType, MongooseSchema } = require('../database/mongoose');
const ModelRef = require('../schema/ModelRef');

module.exports = {
  schema: {
    name: { type: SchemaType.String, require: true },
    key: { type: SchemaType.String, require: true },
    type: { type: SchemaType.String, require: true, enum: ['ObjectId', 'String', 'Number', 'Data', 'FatModelRef', 'ThinModelRef'] },
    ref: {
      type: new MongooseSchema(ModelRef),
    },
  },
};
