const path = require('path');
const dotEnv = require('dotenv');

async function initEnv () {
  await dotEnv.config({
    path: path.resolve(process.cwd(), '.env')
  });
  await dotEnv.config({
    path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
  });
}

module.exports = {
  initEnv
};
