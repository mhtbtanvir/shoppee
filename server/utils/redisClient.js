const redis = require('redis');

// Use REDIS_URL from environment variables
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const redisClient = redis.createClient({ url: redisUrl });

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
  }
})();

module.exports = redisClient;
