const logger = require('./logger');
const redis = require('redis');

let redisClient;

const REDIS_URI = process.env.REDIS_URI || "redis://localhost:6379"
const REDIS_OPTIONS = {
    enable_offline_queue: process.env.REDIS_OPTIONS || false
}

redisClient = redis.createClient(REDIS_URI, REDIS_OPTIONS);

redisClient.on('connect', (err) => {
    logger.info('Connected to Redis Client!!');
});

redisClient.on('error', (err) => {
    logger.error(err);
});

module.exports = redisClient;