const { SchemaType } = require('../database/mongoose');

module.exports = {
  schema: {
    model_name: { type: SchemaType.String, required: true },
    collection_name: { type: SchemaType.String, required: true, unique: true },
    properties: [{ type: SchemaType.ObjectId, ref: 'DataProperty' }],
    create_time: { type: SchemaType.Date, required: true, default: new Date() },
    update_time: { type: SchemaType.Date, required: true, default: new Date() },
    belong_system: { type: SchemaType.ObjectId, ref: 'DataSystem' },
  },
};
