const { SchemaType } = require('../database/mongoose');

module.exports = {
  schema: {
    system_name: { type: SchemaType.String, require: true },
    system_user: { type: SchemaType.String, require: true, unique: true },
    system_password: { type: SchemaType.String, require: true },
    database_name: { type: SchemaType.String, require: true, unique: true },
  },
};
