const { SchemaType } = require('../database/mongoose');

module.exports = {
  target_model: { type: SchemaType.ObjectId, default: null },
  filter_condition: { type: SchemaType.Mixed, default: {} },
  source_key: { type: SchemaType.String, default: null },
  target_key: { type: SchemaType.String, default: null },
};
