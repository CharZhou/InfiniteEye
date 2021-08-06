const { SchemaType } = require('../database/mongoose');

module.exports = {
  target_model: { type: SchemaType.ObjectId, default: null },
  source_key: { type: SchemaType.String, default: null },
  target_key: { type: SchemaType.String, default: null },
  target_node: { type: SchemaType.String, default: null },
};
