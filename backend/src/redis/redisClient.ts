import { Redis } from "ioredis";
const redis = new Redis({
    host: "redis-2849bf3b-prsprshr-2153.a.aivencloud.com",
    port: 24319,
    username: "default",
    password: "AVNS_aGj3m6QmHkzUKeREd3t",
});

redis.on('error', (err) => {
    console.error('Redis error:', err.message);
});
export { redis }
