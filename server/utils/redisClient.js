// redisClient.js
const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// Immediately connect when this module is loaded
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
})();

module.exports = redisClient;
