const { SchemaType } = require('../database/mongoose');

module.exports = {
  schema: {
    modelName: { type: SchemaType.String, required: true },
    modelCollectionName: { type: SchemaType.String, required: true, unique: true },
    modelProperty: [{ type: SchemaType.ObjectId, ref: 'DataProperty' }],
    create_time: { type: SchemaType.Date, required: true, default: new Date() },
    update_time: { type: SchemaType.Date, required: true, default: new Date() },
  },
};
