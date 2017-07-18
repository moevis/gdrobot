var redis = require("redis"),
    client = redis.createClient(6379, process.env.redis_server || '127.0.0.1';);

module.exports = client;
