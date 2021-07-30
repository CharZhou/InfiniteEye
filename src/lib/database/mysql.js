const mysql = require('mysql');
const config = require('config');
const { getLogger } = require('../utils/log');
const mysqlConfig = config.get('mysql');

let poolHandle;

async function getMySqlConnection () {
  if (!poolHandle) {
    poolHandle = await mysql.createPool(mysqlConfig);
    getLogger('mysql').info('Mysql Connected');
  }

  return poolHandle;
}

async function makeQuery (queryStatement) {
  const handle = await getMySqlConnection();
  return new Promise((resolve, reject) => {
    handle.getConnection((err, conn) => {
      if (err) {
        reject(err);
      } else {
        conn.query(queryStatement, (err, result) => {
          conn.release();
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });
}

getMySqlConnection();

module.exports = {
  makeQuery
};
