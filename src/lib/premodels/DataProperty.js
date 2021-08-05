const { SchemaType, MongooseSchema } = require('../database/mongoose');
const ModelRef = require('../schema/ModelRef');
const { allowedDataPropertyType } = require('../constant/dataproperty');

module.exports = {
  schema: {
    name: { type: SchemaType.String, require: true },
    key: { type: SchemaType.String, require: true },
    type: { type: SchemaType.String, require: true, enum: Object.keys(allowedDataPropertyType) },
    ref: {
      type: new MongooseSchema(ModelRef),
      require: true,
    },
  },
};
