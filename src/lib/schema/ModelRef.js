const { SchemaType } = require('../database/mongoose');

module.exports = {
  target_model: { type: SchemaType.ObjectId, required: true },
  filter_condition: { type: SchemaType.Mixed, required: true, default: {} },
  source_key: { type: SchemaType.String, required: true },
  target_key: { type: SchemaType.String, required: true },
};
