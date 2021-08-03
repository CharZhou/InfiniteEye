const { SchemaType, MongooseSchema } = require('../database/mongoose');
const FatModelRef = require('../schema/ThinDataModel/FatModelRef');

module.exports = {
  schema: {
    name: { type: SchemaType.String, require: true },
    key: { type: SchemaType.String, require: true },
    type: { type: SchemaType.String, require: true, enum: ['ObjectId', 'String', 'Number', 'Data', 'FatModelRef'] },
    ref: {
      type: new MongooseSchema(FatModelRef),
    },
  },
};
