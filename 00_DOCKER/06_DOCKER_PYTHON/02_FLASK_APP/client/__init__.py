import redis
client = redis.Redis(
    host="redisdb",
    port= 6379,
    password=""
)