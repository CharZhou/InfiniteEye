const { SchemaType } = require('../database/mongoose');

module.exports = {
  modelName: { type: SchemaType.String, required: true },
  modelProperty: [{ type: SchemaType.ObjectId, ref: 'DataProperty' }],
  create_time: { type: SchemaType.Date, required: true, default: new Date() },
  update_time: { type: SchemaType.Date, required: true, default: new Date() },
};
