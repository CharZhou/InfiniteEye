const { SchemaType } = require('../database/mongoose');

module.exports = {
  transfer_rule: { type: SchemaType.String, default: null },
  source_key: { type: SchemaType.String, default: null },
  transfer_param: { type: SchemaType.Mixed, default: {} },
};
