const Redis = require('ioredis');
const config = require('config');
const redisConfig = config.get('redis');
const { getLogger } = require('../utils/log');

let client;

async function getRedisClient () {
  if (!client) {
    try {
      client = new Redis({
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        keepAlive: redisConfig.keepalive,
        lazyConnect: true
      });
      await client.connect();
      getLogger('redis').info('Redis Connected');
    } catch (err) {
      getLogger('redis').error('Redis Connect Fail', err);
    }
  }
  return client;
}

getRedisClient();

module.exports = { getRedisClient };
