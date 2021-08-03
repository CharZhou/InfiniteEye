const { SchemaType } = require('../database/mongoose');

module.exports = {
  schema: {
    name: { type: SchemaType.String, require: true },
    key: { type: SchemaType.String, require: true },
    type: { type: SchemaType.String, require: true, enum: ['ObjectId', 'String', 'Number'] },
  },
};
