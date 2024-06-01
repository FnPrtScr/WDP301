'use strict';
const redis = require('redis');
const { REDIS_HOST, REDIS_PORT } = process.env

const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
});

// Kiểm tra kết nối
client.on('connect', () => {
    console.log('>>> Connected to Redis');
});

// const subscriber = redis.createClient();
// subscriber.subscribe('semester_expired');
// subscriber.on('message', async function (channel, message) {
//     if (channel === 'semester_expired') {
//         console.log('Semester đã hết hạn:', message);
//     }
// });
client.on('error', (err) => {
    console.error(`Error connecting to Redis: ${err}`);
});

module.exports = client;
